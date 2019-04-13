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
export interface ResultSuccess {
    amount: number;
    currency: string;
    response_code: string;
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
declare type PaymentType = "Regular" | "Recurring" | "MOTO";
export interface TokenSource {
    type: string;
    token: string;
    billing_address?: Address;
    phone?: Phone;
}
export interface IdSource {
    type: string;
    id: string;
    cvv?: string;
}
export interface CardSource {
    type: string;
    number: string;
    expiry_month: string;
    expiry_year: string;
    name?: string;
    cvv?: string;
    stored?: boolean;
    billing_address?: Address;
    phone?: Phone;
}
export interface CustomerSource {
    type: string;
    id?: string;
    email?: string;
}
export interface CustomerSource {
    type: string;
    id?: string;
    email?: string;
}
declare type NetworkTokenType = "vts" | "mdes" | "applepay" | "googlepay";
export interface NetworkTokenSource {
    type: string;
    token: string;
    expiry_month: string;
    expiry_year: string;
    token_type: NetworkTokenType;
    cryptogram: string;
    eci: string;
    stored?: boolean;
    name?: string;
    cvv?: string;
    billing_address?: Address;
    phone?: Phone;
}
export interface AlipaySource {
    type: string;
}
export interface BoletoSource {
    type: string;
    birthDate: string;
    cpf: string;
    customerName: string;
}
export interface PaymentRequest {
    source: TokenSource | IdSource | CardSource | NetworkTokenSource | AlipaySource | BoletoSource;
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
    threed_secure?: ThreeDSecure;
    previous_payment_id?: string;
    risk?: string;
    success_url?: string;
    failure_url?: string;
    payment_ip?: string;
    recipient?: Recipient;
    processing?: Processing;
    metadata?: Metadata;
}
export interface PaymentSuccess {
    amount: number;
    is_successful: string;
    is_approved: string;
    is_pending: string;
}
export interface PaymentActionRequired {
    id: number;
    status: string;
    reference?: string;
    customer?: Customer;
    threeds?: ThreeDSecureResponse;
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
export {};
