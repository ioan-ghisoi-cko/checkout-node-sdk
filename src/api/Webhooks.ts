import {
    HttpConfigurationType,
    Http,
    RetriveWebhookResponseType,
    RetriveWebhookResponse,
    Environment,
    DEFAULT_TIMEOUT
} from "../index";
import { determineError } from "../utils/ErrorHandler";
import { CardSource, ApplePaySource, GooglePaySource } from "../models/request";
import BaseEndpoint from "./BaseEndpoint";

export default class Webhooks extends BaseEndpoint {

    constructor(
        key: string,
        http_options: HttpConfigurationType = {
            timeout: DEFAULT_TIMEOUT, environment: Environment.Sandbox
        }
    ) {
        super(key, http_options);
    }

    public retrieve = async (): Promise<RetriveWebhookResponse> => {
        try {
            const getPayment = await this._getHandler(`${this.httpConfiguration.environment}/webhooks`);
            return new RetriveWebhookResponse(await getPayment.json);
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
