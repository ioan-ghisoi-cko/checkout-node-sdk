import {
    EventTypesResponseType,
    EventType
} from "../../index";

export class EventTypesResponse {
    public instances: [EventType];

    constructor(response: EventTypesResponseType) {
        this.instances = response;
    }
}

