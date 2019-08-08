import {
    PaymentResponseType,
    ThreeDSecureResponse,
    Risk,
    SourceResponse,
    Customer,
    Links,
    DestinationResponse,
    PaymentHeaders
} from "../types/Types";


/**
 * PaymentResponse class
 *
 * @export
 * @class PaymentResponse
 */
export class PaymentResponse {
    public headers: PaymentHeaders;
    public id: string;
    public action_id: string;
    public amount: number;
    public currency: string;
    public approved: boolean;
    public status: string;
    public auth_code: string;
    public response_code: string;
    public response_summary: string;
    public "3ds": ThreeDSecureResponse;
    public risk: Risk;
    public source: SourceResponse;
    public destination?: DestinationResponse;
    public customer: Customer;
    public processed_on: string;
    public reference: string;
    public eci: string;
    public scheme_id: string;
    public _links: Links;

    constructor(response: PaymentResponseType) {
        this.headers = response.headers;
        this.id = response.id;
        this.action_id = response.action_id;
        this.amount = response.amount;
        this.currency = response.currency;
        this.approved = response.approved;
        this.status = response.status;
        this.auth_code = response.auth_code;
        this.response_code = response.response_code;
        this.response_summary = response.response_summary;
        this["3ds"] = response["3ds"];
        this.risk = response.risk;
        this.destination = response.destination;
        this.source = response.source;
        this.customer = response.customer;
        this.processed_on = response.processed_on;
        this.reference = response.reference;
        this.eci = response.eci;
        this.scheme_id = response.scheme_id;
        this._links = response._links;
    }


    /**
     * Determines if the transaction authorisation is completed and no
     * further action is required.
     *
     * @memberof PaymentResponse
     */
    public isCompleted = (): boolean => {
        return this.status === "Pending" ?
            false :
            this.approved &&
            this.risk.flagged !== true &&
            this.status === "Authorized" &&
            this.response_summary === "Approved";
    }

    /**
     * Determines if the transaction authorisation requires an additional
     * verification (redirection). This is generally the case for 3DS or
     * local payment options.
     *
     * @memberof PaymentResponse
     */
    public requiresRedirect = (): boolean => {
        return this.status === "Pending";
    }

    /**
     * Determines if the transaction authorisation was flagged by any of
     * the risk rules of the business. A positive outcome generally indicates
     * a success, but where manually review is required for completion.
     *
     * @memberof PaymentResponse
     */
    public isFlagged = (): boolean => {
        return this.status === "Pending" ? false : this.risk.flagged;
    }
}
