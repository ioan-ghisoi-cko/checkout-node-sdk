import { Environment } from '../index';
export type PaymentType = "Regular" | "Recurring" | "MOTO";
export type NetworkTokenType = "vts" | "mdes" | "applepay" | "googlepay";
export type RequestType = "get" | "post" | "put" | "patch";
export type EnvironmentType = Environment.Live | Environment.Sandbox;

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
    flagged: boolean;
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
    "3ds"?: ThreeDSecure;
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
    redirect?: Link;
}

export interface _PaymentProcessed {
    id: string;
    action_id: string;
    amount: number;
    currency: string;
    approved: boolean;
    status: string;
    auth_code: string;
    response_code: string;
    response_summary: string;
    "3ds": ThreeDSecureResponse;
    risk: Risk;
    source: SourceResponse;
    customer: Customer;
    processed_on: string;
    reference: string;
    eci: string;
    scheme_id: string;
    _links: Links;
}

export interface _PaymentActionRequired {
    id: number;
    status: string;
    reference?: string;
    customer?: Customer;
    "3ds"?: ThreeDSecureResponse;
    _links: Links;
}

export interface ThreeDSecureResponse {
    downgraded: boolean;
    enrolled: string;
}

export interface PaymentOutcome {
    http_code: number;
    body: _PaymentProcessed | _PaymentActionRequired;
}

export interface _PaymentError {
    request_id: string;
    error_type: string;
    error_codes: string[];
}

export interface PaymentError {
    http_code: number;
    body: _PaymentError;
}

export interface InfoField {
    label: string;
    text: string;
}

export interface InfoFields {
    [key: string]: InfoField;
}

export type TokenSourceType = {
    token: string;
    billing_address?: Address;
    phone?: Phone;
};

export type IdSourceType = {
    id: string;
    cvv?: string;
};

export type CardSourceType = {
    number: string;
    expiry_month: string;
    expiry_year: string;
    name?: string;
    cvv?: string;
    stored?: boolean;
    billing_address?: Address;
    phone?: Phone;
};

export type CustomerSourceType = {
    id?: string;
    email?: string;
};

export type NetworkTokenSourceType = {
    token: string;
    expiry_month: number;
    expiry_year: number;
    token_type: NetworkTokenType;
    cryptogram: string;
    eci: string;
    stored?: string;
    name?: string;
    cvv?: string;
    billing_address?: Address;
    phone?: Phone;
};

export type BoletoSourceType = {
    birthDate: string;
    cpf: string;
    customerName: string;
};

export type GiropaySourceType = {
    purpose: string;
    bic: string;
    iban?: string;
    info_fields?: InfoFields;
};

export type IdealSourceType = {
    description: string;
    bic: string;
    language?: string;
};
export type KlarnaSourceType = {
    authorization_token: string;
    locale: string;
    purchase_country: string;
    auto_capture?: boolean;
    billing_address: any;
    shipping_address?: any;
    tax_amount: number;
    products: any;
    customer?: any;
    merchant_reference1?: string;
    merchant_reference2?: string;
    merchant_data?: any;
};

export type QiwiSourceType = {
    walletId: string;
};


export type HttpRequestParams = {
    path: string;
    authorization: string;
    method: RequestType;
    body?: any;
};


export type HttpConfig = {
    environment?: EnvironmentType;
    timeout: number;
};
