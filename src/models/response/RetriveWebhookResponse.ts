import {
    RetriveWebhookResponseType,
} from "../../index";
import { WebhookInstance } from "../types/Types";


/**
 * RetriveWebhookResponse class
 *
 * @export
 * @class RetriveWebhookResponse
 */
export class RetriveWebhookResponse {
    public instances: [WebhookInstance];

    constructor(response: RetriveWebhookResponseType) {
        this.instances = response;
    }
}

/**
 * NoWebhooksConfigured class
 *
 * @export
 * @class NoWebhooksConfigured
 */
export class NoWebhooksConfigured {
    public http_code: number;

    constructor(http_code: number) {
        this.http_code = http_code;
    }
}
