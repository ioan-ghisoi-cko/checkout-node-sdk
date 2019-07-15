import {
    RetrieveEventsResponseType,
    EventSummary
} from "../../index";


/**
 * RetriveEventsResponse class
 *
 * @export
 * @class RetriveEventsResponse
 */
export class RetriveEventsResponse {
    public total_count: number;
    public limit: number;
    public skip: number;
    public from: string;
    public to: string;
    public data: EventSummary[];

    constructor(response: RetrieveEventsResponseType) {
        this.total_count = response.total_count;
        this.limit = response.limit;
        this.skip = response.skip;
        this.from = response.from;
        this.to = response.to;
        this.data = response.data;
    }
}
