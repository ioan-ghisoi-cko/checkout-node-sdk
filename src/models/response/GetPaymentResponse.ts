import {
    ThreeDSecureResponse,
    Risk,
    SourceResponse,
    Customer,
    Links,
    GetPaymentResponseType
} from "../../index";

import {
    PaymentType,
    BillingDescriptor,
    Shipping,
    Recipient,
    PaymentEvent
} from "../types/Types";

export class GetPaymentResponse {
    id: string;
    requested_on: string;
    source: SourceResponse;
    amount: string;
    currency: string;
    payment_type: PaymentType;
    reference: string;
    approved: boolean;
    status: string;
    "3ds": ThreeDSecureResponse;
    risk: Risk;
    customer: Customer;
    billing_descriptor: BillingDescriptor;
    shipping: Shipping;
    recipient: Recipient;
    metadata: any;
    eci: string;
    scheme_id: string;
    actions: [PaymentEvent];
    _links: Links;

    constructor(response: GetPaymentResponseType) {
        this.id = response.id;
        this.requested_on = response.requested_on;
        this.source = response.source;
        this.currency = response.currency;
        this.amount = response.amount;
        this.payment_type = response.payment_type;
        this.reference = response.reference;
        this.approved = response.approved;
        this.status = response.status;
        this["3ds"] = response["3ds"];
        this.risk = response.risk;
        this.customer = response.customer;
        this.billing_descriptor = response.billing_descriptor;
        this.shipping = response.shipping;
        this.recipient = response.recipient;
        this.metadata = response.metadata;
        this.eci = response.eci;
        this.scheme_id = response.scheme_id;
        this.actions = response.actions;
        this._links = response._links;
    }
}
