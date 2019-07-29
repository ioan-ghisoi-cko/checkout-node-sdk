import {
    HttpConfigurationType,
    Http,
    RetriveWebhookResponse,
    Environment,
    DEFAULT_TIMEOUT,
    RequestType
} from "../index";
import { determineError } from "../utils/ErrorHandler";
import BaseEndpoint from "./BaseEndpoint";
import { NewWebhookInstance } from "../models/types/Types";
import { WebhookResponse } from "../models/response";


/**
 * Webhooks class
 *
 * @export
 * @class Webhooks
 * @extends {BaseEndpoint}
 */
export default class Webhooks extends BaseEndpoint {


    /**
     * Creates an instance of Webhooks.
     *
     * @param {string} key
     * @param {http_options} HttpConfigurationType
     * @param {HttpConfigurationType.timeout} HttpConfigurationType.timeout HTTP request timeout
     * @param {HttpConfigurationType.environment} HttpConfigurationType.environment default: Sandbox; API Environment
     * @memberof Payments
     * @memberof Webhooks
     */
    constructor(
        key: string,
        http_options: HttpConfigurationType = {
            timeout: DEFAULT_TIMEOUT, environment: Environment.Sandbox
        }
    ) {
        super(key, http_options);
    }


    /**
     * Retrieves the webhooks configured for the channel identified by your API key
     *
     * @memberof Webhooks
     * @return {Promise<RetriveWebhookResponse>} A promise to the retrieve webhooks response.
     */
    public retrieveWebhooks = async (): Promise<RetriveWebhookResponse> => {
        try {
            const getWebhooks = await this._getHandler(`${this.httpConfiguration.environment}/webhooks`);
            if (getWebhooks.status === 204) {
                throw { status: 204 }
            } else {
                return new RetriveWebhookResponse(await getWebhooks.json);
            }
        } catch (err) {
            throw await determineError(err);
        }
    };

    /**
     * Register a new webhook endpoint that Checkout.com will POST all or selected events to
     *
     * @memberof Webhooks
     * @param {arg} NewWebhookInstance Webhook body
     * @return {Promise<WebhookResponse>} A promise to the update webhook response.
     */
    public register = async (arg: NewWebhookInstance): Promise<WebhookResponse> => {
        try {
            const http = new Http(this.httpConfiguration);
            const response = await http.send({
                method: "post",
                url: `${this.httpConfiguration.environment}/webhooks`,
                headers: {
                    Authorization: this.key
                },
                body: { arg }
            });
            return new WebhookResponse(await response.json);
        } catch (err) {
            throw await determineError(err);
        }
    };

    /**
     * Register a new webhook endpoint that Checkout.com will POST all or selected events to.
     *
     * @memberof Webhooks
     * @param {id} string The webhook identifier, for example wh_387ac7a83a054e37ae140105429d76b5
     * @return {Promise<WebhookResponse>} A promise to the retrieve webhook response.
     */
    public retrieveWebhook = async (id: string): Promise<WebhookResponse> => {
        try {
            const getWebhooks = await this._getHandler(`${this.httpConfiguration.environment}/webhooks/${id}`);
            return new WebhookResponse(await getWebhooks.json);
        } catch (err) {
            throw await determineError(err);
        }
    };

    /**
     * Updates an existing webhook
     *
     * @memberof Webhooks
     * @param {id} string The webhook identifier, for example wh_387ac7a83a054e37ae140105429d76b5
     * @param {body} NewWebhookInstance Webhook body
     * @return {Promise<WebhookResponse>} A promise to the update webhook response.
     */
    public update = async (id: string, body: NewWebhookInstance): Promise<WebhookResponse> => this._updateHandler(
        "put",
        `${this.httpConfiguration.environment}/webhooks/${id}`,
        body,
    );

    /**
     * Partially updates an existing webhook
     *
     * @memberof Webhooks
     * @param {id} string The webhook identifier, for example wh_387ac7a83a054e37ae140105429d76b5
     * @param {body} NewWebhookInstance Webhook body
     * @return {Promise<WebhookResponse>} A promise to the partial update webhook response.
     */
    public partialUpdate = async (id: string, body: NewWebhookInstance): Promise<WebhookResponse> => this._updateHandler(
        "patch",
        `${this.httpConfiguration.environment}/webhooks/${id}`,
        body,
    );

    /**
     * Partially updates an existing webhook
     *
     * @memberof Webhooks
     * @param {id} string The webhook identifier, for example wh_387ac7a83a054e37ae140105429d76b5
     */
    public remove = async (id: string) => {
        try {
            const http = new Http(this.httpConfiguration);
            const response = await http.send({
                method: "delete",
                url: `${this.httpConfiguration.environment}/webhooks/${id}`,
                headers: {
                    Authorization: this.key
                }
            });
            return new WebhookResponse(await response.json);
        } catch (err) {
            throw await determineError(err);
        }
    };

    /**
     * Handle all GET requests to remove duplication
     *
     * @private
     * @memberof Payments
     */
    private _getHandler = async (
        url: string,
    ): Promise<any> => {
        const http = new Http(this.httpConfiguration);
        return http.send({
            method: "get",
            url,
            headers: {
                Authorization: this.key
            },
        });
    }

    /**
     * Handle all PATCH/PUT requests to remove duplication
     *
     * @private
     * @memberof Webhooks
     */
    private _updateHandler = async (
        action: RequestType,
        url: string,
        body?: NewWebhookInstance,
    ): Promise<WebhookResponse> => {
        const http = new Http(this.httpConfiguration);
        try {
            const response = await http.send({
                method: action,
                url,
                headers: {
                    Authorization: this.key
                },
                body
            });
            return new WebhookResponse(await response.json);
        } catch (err) {
            throw await determineError(err);
        }
    }
}
