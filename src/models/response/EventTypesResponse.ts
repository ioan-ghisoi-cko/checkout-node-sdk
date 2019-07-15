import {
    EventTypesResponseType,
    EventType
} from "../../index";


/**
 * EventTypesResponse class
 *
 * @export
 * @class EventTypesResponse
 */
export class EventTypesResponse {
    public instances: [EventType];

    constructor(response: EventTypesResponseType) {
        this.instances = response;
    }
}

