import {
    RetrieveEventNotificationType,
    RetrieveEventNotificationLinks,
    Attempt
} from "../../index";


/**
 * RetriveEventNotification class
 *
 * @export
 * @class RetriveEventNotification
 */
export class RetriveEventNotification {
    public id: string;
    public url: string;
    public success: boolean;
    public content_type: string;
    public attempts: Attempt[];
    public _links: RetrieveEventNotificationLinks[];

    constructor(response: RetrieveEventNotificationType) {
        this.id = response.id;
        this.url = response.url;
        this.success = response.success;
        this.content_type = response.content_type;
        this.attempts = response.attempts;
        this._links = response._links;
    }
}
