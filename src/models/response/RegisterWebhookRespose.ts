import { ContentType } from "../../index";
import { WebhookInstance } from "../types/Types";


/**
 * WebhookResponse
 *
 * @export
 * @class WebhookResponse
 */
export class WebhookResponse {
    public id: string;
    public url: string;
    public active?: boolean;
    public headers?: any;
    public content_type?: ContentType;
    public event_types: string[];

    constructor(response: WebhookInstance) {
        this.id = response.id;
        this.url = response.url;
        this.active = response.active;
        this.headers = response.headers;
        this.content_type = response.content_type;
        this.event_types = response.event_types;
    }
}
