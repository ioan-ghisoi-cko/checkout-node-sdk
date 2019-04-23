export type PaymentType = "Regular" | "Recurring" | "MOTO";
export type NetworkTokenType = "vts" | "mdes" | "applepay" | "googlepay";

export interface Address {
    address_line1: string;
    address_line2: string;
    city: string;
    state: string;
    zip: string;
    country: string;
}

export interface Phone {
    country_code: string;
    number: string;
}

export interface Customer {
    id?: string;
    email?: string;
    name?: string;
}

export interface BillingDescriptor {
    name: string;
    city: string;
}

export interface Shipping {
    address?: Address;
    phone?: Phone;
}

export interface ThreeDSecure {
    enabled?: boolean;
    attempt_n3d?: boolean;
    eci?: string;
    cryptogram?: string;
    xid?: string;
}

export interface Risk {
    enabled: boolean;
}

export interface Processing {
    mid: string;
}

export interface Recipient {
    dob: string;
    account_number: string;
    zip: string;
    last_name: string;
}

export interface Metadata {
    [prop: string]: any;
}

export interface PaymentRequest<T> {
    source: T;
    currency: string;
    amount?: number | string;
    payment_type?: PaymentType;
    reference?: string;
    description?: string;
    capture?: boolean;
    capture_on?: string;
    customer?: Customer;
    billing_descriptor?: BillingDescriptor;
    shipping?: Shipping;
    '3ds'?: ThreeDSecure;
    previous_payment_id?: string;
    risk?: string;
    success_url?: string;
    failure_url?: string;
    payment_ip?: string;
    recipient?: Recipient;
    processing?: Processing;
    metadata?: Metadata;
}

export interface SourceResponse {
    type: string;
    id: string;
    [prop: string]: any;
}

export interface Link {
    href: string;
}

export interface Links {
    self: Link;
    actions?: Link;
    void?: Link;
    capture?: Link;
}

export interface PaymentSuccess {
    id: string;
    action_id: string;
    amount: number;
    currency: string;
    approved: boolean;
    status: string;
    auth_code: string;
    response_code: string;
    response_summary: string;
    '3ds': ThreeDSecureResponse;
    risk: Risk;
    source: SourceResponse;
    customer: Customer;
    processed_on: string;
    reference: string;
    eci: string;
    scheme_id: string;
    links: Links
}

export interface PaymentActionRequired {
    id: number;
    status: string;
    reference?: string;
    customer?: Customer;
    threed_secure?: ThreeDSecureResponse;
    redirect_url?: string;
}

export interface ThreeDSecureResponse {
    downgraded: boolean;
    enrolled: string;
}

export interface PaymentOutcome {
    http_code: number;
    is_successful: boolean;
    is_approved: boolean;
    is_pending: boolean;
    body: PaymentSuccess | PaymentActionRequired;
}

export interface PaymentError {
    request_id: string;
    error_type: string;
    error_codes: string[];
}

export interface InfoField {
    label: string;
    text: string;
}

export interface InfoFields {
    [key: string]: InfoField;
}
