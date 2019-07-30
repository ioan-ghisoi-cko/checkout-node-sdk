import {
    PaymentActionedType,
    CapturedLinks
} from "../types/Types";


/**
 * PaymentActionResponse class
 *
 * @export
 * @class PaymentActionResponse
 */
export class PaymentActionResponse {
    action_id: string;
    reference: string;
    links: CapturedLinks;

    constructor(response: PaymentActionedType) {
        this.action_id = response.action_id;
        this.reference = response.reference;
        this.links = response._links;
    }
}
