import {
    ReconcilePaymentResponseType,
    UploadFileLinks,
    ReconciledPayment
} from "../types/Types";


/**
 * ReconcilePaymentResponse
 *
 * @export
 * @class ReconcilePaymentResponse
 */
export class ReconcilePaymentResponse {
    public count: number;
    public data: ReconciledPayment[];
    public _links: UploadFileLinks;

    constructor(response: ReconcilePaymentResponseType) {
        this.count = response.count;
        this.data = response.data;
        this._links = response._links;
    }
}
