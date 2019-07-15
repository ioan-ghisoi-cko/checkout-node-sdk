import {
    RetrieveEventsLinks,
    Notifications,
    EventData,
    RetrieveEventResponseType
} from "../../index";


/**
 * RetriveEventResponse class
 *
 * @export
 * @class RetriveEventResponse
 */
export class RetriveEventResponse {
    public id: string;
    public type: string;
    public version: string;
    public created_on: string;
    public data: EventData;
    public notifications: Notifications;
    public _links: RetrieveEventsLinks;

    constructor(response: RetrieveEventResponseType) {
        this.id = response.id;
        this.type = response.type;
        this.version = response.version;
        this.created_on = response.created_on;
        this.data = response.data;
        this.notifications = response.notifications;
        this._links = response._links;
    }
}
