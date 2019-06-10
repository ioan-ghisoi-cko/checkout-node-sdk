import { Environment } from '../index';
type _RequestType = "get" | "post" | "put" | "patch";
type _PaymentType = "Regular" | "Recurring" | "MOTO";
type _EnvironmentType = Environment.Live | Environment.Sandbox;

interface _ThreeDSecure {
    enabled?: boolean;
    attempt_n3d?: boolean;
    eci?: string;
    cryptogram?: string;
    xid?: string;
}


interface _Recipient {
    dob: string;
    account_number: string;
    zip: string;
    last_name: string;
}

interface _Processing {
    mid: string;
}

interface _Metadata {
    [prop: string]: any;
}

interface _Link {
    href: string;
}

export interface Links {
    self: _Link;
    actions?: _Link;
    void?: _Link;
    capture?: _Link;
    redirect?: _Link;
}

export type HttpConfigurationType = {
    timeout: number;
    environment: _EnvironmentType;
};

export type HttpRequestParamsType = {
    url: string;
    authorization: string;
    method: _RequestType;
    body?: any;
};

export interface Address {
    address_line1: string;
    address_line2: string;
    city: string;
    state: string;
    zip: string;
    country: string;
}

export interface Phone {
    country_code?: string;
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

export interface PaymentRequest<T> {
    source: T;
    currency: string;
    amount?: number | string;
    payment_type?: _PaymentType;
    reference?: string;
    description?: string;
    capture?: boolean;
    capture_on?: string;
    customer?: Customer;
    billing_descriptor?: BillingDescriptor;
    shipping?: Shipping;
    "3ds"?: _ThreeDSecure;
    previous_payment_id?: string;
    risk?: string;
    success_url?: string;
    failure_url?: string;
    payment_ip?: string;
    recipient?: _Recipient;
    processing?: _Processing;
    metadata?: _Metadata;
}

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

export interface PaymentResponseType {
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
    isPending: () => boolean;
}

export interface ThreeDSecureResponse {
    downgraded: boolean;
    enrolled: string;
}

export interface Risk {
    flagged: boolean;
}

export interface SourceResponse {
    type: string;
    id: string;
    [prop: string]: any;
}

export interface PaymentError {
    request_id: string;
    error_type: string;
    error_codes: string[];
}