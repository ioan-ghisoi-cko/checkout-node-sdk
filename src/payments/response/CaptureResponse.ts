import {
    PaymentActionedType,
    CapturedLinks
} from "../../models/Types";

export class CaptureResponse {
    action_id: string;
    reference: string;
    links: CapturedLinks;

    constructor(response: PaymentActionedType) {
        this.action_id = response.action_id;
        this.reference = response.reference;
        this.links = response['_links'];
    }
}
