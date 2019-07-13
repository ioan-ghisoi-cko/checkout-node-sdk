import {
    RetriveWebhookResponseType,
    ContentType
} from "../../index";
import { WebhookInstance } from "../types/Types";

export class RetriveWebhookResponse {
    public instances: [WebhookInstance];

    constructor(response: RetriveWebhookResponseType) {
        this.instances = response;
    }
}
