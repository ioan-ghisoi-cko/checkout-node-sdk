import { Environment } from "../index";
import * as Source from "../models/Sources";
type _RequestType = "get" | "post" | "put" | "patch";
type _EnvironmentType = Environment.Live | Environment.Sandbox;

interface ThreeDSecure {
    enabled?: boolean;
    attempt_n3d?: boolean;
    eci?: string;
    cryptogram?: string;
    xid?: string;
}

interface Processing {
    mid: string;
}

interface Metadata {
    [prop: string]: any;
}

interface Headers {
    [prop: string]: any;
}

interface Link {
    href: string;
}

export interface PaymentEvent {
    id: string;
    type: PaymentEventType;
    response_code: string;
    response_summary: string;
}

export type PaymentType = "Regular" | "Recurring" | "MOTO";
export type PaymentEventType = "Authorization" | "Card Verification" | "Void" | "Capture" | "Refund";

export interface Recipient {
    dob: string;
    account_number: string;
    zip: string;
    last_name: string;
}

export interface Links {
    self: Link;
    actions?: Link;
    void?: Link;
    capture?: Link;
    redirect?: Link;
}

export interface HttpConfigurationType {
    timeout: number;
    environment: _EnvironmentType;
}

export interface HttpRequestParamsType {
    url: string;
    headers: Headers;
    method: _RequestType;
    body?: any;
}

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

export interface CardSourceType {
    number: string;
    expiry_month: string;
    expiry_year: string;
    name?: string;
    cvv?: string;
    stored?: boolean;
    billing_address?: Address;
    phone?: Phone;
}

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

export interface GetPaymentResponseType {
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
}
