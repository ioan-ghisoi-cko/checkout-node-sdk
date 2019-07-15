import {
    RetriveWebhookResponseType,
} from "../../index";
import { WebhookInstance } from "../types/Types";

export class RetriveWebhookResponse {
    public instances: [WebhookInstance];

    constructor(response: RetriveWebhookResponseType) {
        this.instances = response;
    }
}

export class NoWebhooksConfigured {
    public http_code: number;

    constructor(http_code: number) {
        this.http_code = http_code;
    }
}
