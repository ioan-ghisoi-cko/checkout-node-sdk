import {
    GetDisputesResponseType,
    DisputeSummary
} from "../../index";



/**
 *
 *
 * @export
 * @class GetDisputesResponse
 */
export class GetDisputesResponse {
    public limit: number;
    public skip: number;
    public from: string;
    public to: string;
    public id: string;
    public statuses: string;
    public payment_id: string;
    public payment_reference: string;
    public payment_arn: string;
    public this_channel_only: boolean;
    public total_count: boolean;
    public data: DisputeSummary[];

    constructor(response: GetDisputesResponseType) {
        this.limit = response.limit;
        this.skip = response.skip;
        this.from = response.from;
        this.to = response.to;
        this.id = response.id;
        this.statuses = response.statuses;
        this.payment_id = response.payment_id;
        this.payment_reference = response.payment_reference;
        this.payment_arn = response.payment_arn;
        this.this_channel_only = response.this_channel_only;
        this.total_count = response.total_count;
        this.data = response.data;
    }
}

