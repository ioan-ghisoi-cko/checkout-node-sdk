import {
    HttpConfigurationType,
    Http,
    RetriveWebhookResponse,
    Environment,
    DEFAULT_TIMEOUT
} from "../index";
import { determineError } from "../utils/ErrorHandler";
import BaseEndpoint from "./BaseEndpoint";
import { NewWebhookInstance } from "../models/types/Types";
import { WebhookResponse } from "../models/response";

export default class Webhooks extends BaseEndpoint {

    constructor(
        key: string,
        http_options: HttpConfigurationType = {
            timeout: DEFAULT_TIMEOUT, environment: Environment.Sandbox
        }
    ) {
        super(key, http_options);
    }

    public retrieveWebhooks = async (arg?: string): Promise<RetriveWebhookResponse> => {
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

    public retrieveWebhook = async (id: string): Promise<WebhookResponse> => {
        try {
            const getWebhooks = await this._getHandler(`${this.httpConfiguration.environment}/webhooks/${id}`);
            return new WebhookResponse(await getWebhooks.json);
        } catch (err) {
            throw await determineError(err);
        }
    };

    public update = async (id: string, body: NewWebhookInstance): Promise<WebhookResponse> => {
        try {
            const http = new Http(this.httpConfiguration);
            const response = await http.send({
                method: "put",
                url: `${this.httpConfiguration.environment}/webhooks/${id}`,
                headers: {
                    Authorization: this.key
                },
                body
            });
            return new WebhookResponse(await response.json);
        } catch (err) {
            throw await determineError(err);
        }
    };

    public partialUpdate = async (id: string, body: NewWebhookInstance): Promise<WebhookResponse> => {
        try {
            const http = new Http(this.httpConfiguration);
            const response = await http.send({
                method: "patch",
                url: `${this.httpConfiguration.environment}/webhooks/${id}`,
                headers: {
                    Authorization: this.key
                },
                body
            });
            return new WebhookResponse(await response.json);
        } catch (err) {
            throw await determineError(err);
        }
    };

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
}
