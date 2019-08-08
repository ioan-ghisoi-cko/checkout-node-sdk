import {
    GetDisputesDetailsResponseType,
    DisputeCategory,
    DisputeStatus,
    DisputeItems,
    DisputePayment,
    GetDisputesLinks,
} from "../../index";


/**
 *
 *
 * @export
 * @class GetDisputeDetailsResponse
 */
export class GetDisputeDetailsResponse {
    public id: string;
    public category: DisputeCategory;
    public amount: number;
    public currency: string;
    public reason_code: string;
    public status: DisputeStatus;
    public relevant_evidence: [any];
    public items: DisputeItems;
    public evidence_required_by: string;
    public received_on: string;
    public last_update: boolean;
    public payment: DisputePayment;
    public _links: GetDisputesLinks;

    constructor(response: GetDisputesDetailsResponseType) {
        this.id = response.id;
        this.category = response.category;
        this.amount = response.amount;
        this.currency = response.currency;
        this.reason_code = response.reason_code;
        this.status = response.status;
        this.relevant_evidence = response.relevant_evidence;
        this.items = response.items;
        this.evidence_required_by = response.evidence_required_by;
        this.received_on = response.received_on;
        this.last_update = response.last_update;
        this.payment = response.payment;
        this._links = response._links;
    }
}

