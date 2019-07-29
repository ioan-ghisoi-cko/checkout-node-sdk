import { Environment } from "../../config/Environment";
import {
    CardSource
} from "../../models/request/index";

type _SourceRequestType = "sepa";
type SepaMandate = "single" | "recurring";
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

interface Headers {
    [prop: string]: any;
}

interface Link {
    href: string;
}

export type PaymentType = "Regular" | "Recurring" | "MOTO";
export type PaymentEventType = "Authorization" | "Card Verification" | "Void" | "Capture" | "Refund";
export type NetworkTokenType = "vts" | "mdes" | "applepay" | "googlepay";
export type ContentType = "json" | 'xml';
export type RequestType = "get" | "post" | "put" | "patch" | "delete";
export type RetriveWebhookResponseType = [WebhookInstance];
export type EventTypesResponseType = [EventType];
export type Notifications = [Notification];

export interface PaymentEvent {
    id: string;
    type: PaymentEventType;
    response_code: string;
    response_summary: string;
}

export interface Metadata {
    [prop: string]: any;
}

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

export interface AddSourceLinks {
    self: Link;
    cancel?: Link;
}

export interface SepaMandateReference {
    mandate_reference: string;
}

export interface HttpConfigurationType {
    timeout: number;
    environment: _EnvironmentType;
}

export interface HttpRequestParamsType {
    url: string;
    headers: Headers;
    method: RequestType;
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

export interface SepaSourceData {
    first_name: string;
    last_name: string;
    account_iban: string;
    bic: string;
    billing_descriptor: string;
    mandate_type: SepaMandate;
}

export interface SourceRequest {
    type: _SourceRequestType;
    reference?: string;
    billing_address: Address;
    phone?: Phone;
    customer?: Customer;
    source_data: SepaSourceData;
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

export type TokenSourceType = {
    token: string;
    billing_address?: Address;
    phone?: Phone;
};

export type IdSourceType = {
    id: string;
    cvv?: string;
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

export type BancontactSourceType = {
    payment_country: string;
    account_holder_name: string;
    billing_descriptor?: string;
};

export type EpsSourceType = {
    purpose: string;
    bic?: string;
};

export type FawryProduct = {
    product_id: string;
    quantity: number;
    price: number;
    description: string;
};


export type FawrySourceType = {
    description: string;
    customer_profile_id?: string;
    customer_email: string;
    customer_mobile: string;
    expires_on?: string;
    products: FawryProduct[];
};

export type KlarnaAddress = {
    organization_name?: string;
    reference?: string;
    attention?: string;
    given_name?: string;
    family_name?: string;
    email?: string;
    title?: string;
    street_address?: string;
    street_address2?: string;
    street_name?: string;
    street_number?: string;
    house_extension?: string;
    postal_code?: string;
    city?: string;
    region?: string;
    phone?: string;
    country?: string;
    care_of?: string;
};


export type KlarnaProductIdentifiers = {
    category_path?: string;
    global_trade_item_number?: string;
    manufacturer_part_number?: string;
    brand?: string;
};

export type KlarnaProductDimensions = {
    height?: number;
    width?: string;
    length?: string;
};

export type KlarnaShippingAttributes = {
    weight?: number;
    dimensions?: KlarnaProductDimensions;
    tags?: string[];
};

export type KlarnaProduct = {
    type?: string;
    reference?: string;
    name?: string;
    quantity?: number;
    quantity_unit?: number;
    unit_price?: number;
    tax_rate?: number;
    total_amount?: number;
    total_discount_amount?: number;
    total_tax_amount?: number;
    merchant_data?: string;
    product_url?: string;
    image_url?: string;
    product_identifiers?: KlarnaProductIdentifiers;
    shipping_attributes?: KlarnaShippingAttributes;
};

export type KlarnaCustomer = {
    date_of_birth?: string;
    type?: string;
    organization_registration_id?: string;
    gender?: string;
};

export type KlarnaSourceType = {
    authorization_token: string;
    locale: string;
    purchase_country: string;
    auto_capture?: boolean;
    billing_address: KlarnaAddress;
    shipping_address?: KlarnaAddress;
    tax_amount: number;
    products: KlarnaProduct[];
    customer?: KlarnaCustomer;
    merchant_reference1?: string;
    merchant_reference2?: string;
    merchant_data?: string;
    attachment?: any;
};

export type KnetLanguage = "ar" | "en";

export type KnetSourceType = {
    language: KnetLanguage;
    user_defined_field1?: string;
    user_defined_field2?: string;
    user_defined_field3?: string;
    user_defined_field4?: string;
    user_defined_field5?: string;
    card_token?: string;
    ptlf?: string;
};

export type QpaySourceType = {
    quantity?: number;
    description: string;
    language?: string;
    national_id?: string;
};

export interface InfoField {
    label: string;
    text: string;
}

export interface InfoFields {
    [key: string]: InfoField;
}

export type GiropaySourceType = {
    purpose: string;
    bic?: string;
    iban?: string;
    info_fields?: InfoFields;
};

export type IdealSourceType = {
    description: string;
    bic: string;
    language?: string;
};

export type QiwiSourceType = {
    walletId: string;
};

export interface AddSourceResponseType {
    id: string,
    type: string,
    response_code: string,
    customer?: Customer;
    response_data: SepaMandateReference;
    _links: AddSourceLinks;
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

export interface ActionProcessing {
    retrieval_reference_number: string;
    acquirer_reference_number: string;
    acquirer_transaction_id: string;
}

export interface PaymentAction {
    id: string;
    type: string;
    processed_on: string;
    amount: string;
    approved?: boolean;
    auth_code?: string;
    response_code?: string;
    response_summary?: string;
    reference?: string;
    processing?: ActionProcessing;
    metadata: Metadata
}


export interface GetPaymentActionsResponseType {
    [prop: string]: PaymentAction;
}

export interface CapturedLinks {
    payment: Link;
    redirect: Link;
}

export interface PaymentActionedType {
    action_id: string;
    reference: string;
    _links: CapturedLinks;
}

export interface VoidActionBody {
    reference: string;
    metadata: Metadata;
}

export interface CaptureActionBody extends VoidActionBody {
    amount: number;
}

export interface RefundActionBody extends VoidActionBody {
    amount: number;
}

export interface AppleTokenData {
    version: string;
    data: string;
    signature: string;
    header: string;
}

export interface GoogleTokenData {
    signature: string;
    protocolVersion: string;
    signedMessage: string;
}

export interface TokenData<T> {
    token_data: T;
}

export interface CreateTokenResponseType {
    type: string;
    token: string;
    expires_on: string;
    expiry_month: number;
    expiry_year: number;
    scheme: string;
    last4: string;
    bin: string;
    card_type: string;
    card_category: string;
    issuer: string;
    issuer_country: string;
    product_id: string;
    product_type: string;
    billing_address?: Address;
    phone?: Phone;
    name?: string;
}

export interface NewWebhookInstance {
    url: string;
    active?: boolean;
    headers?: any;
    content_type?: ContentType;
    event_types: string[];
}

export interface WebhookInstance extends NewWebhookInstance {
    id: string;
}

export interface EventType {
    version: string;
    event_types: string[];
}


export interface RetrieveEventsParams {
    from?: string;
    to?: string;
    limit?: string;
    skip?: string;
    payment_id?: string;
    reference?: string;
}

export interface RetrieveEventsLinks {
    self: Link;
    webhooks_retry?: Link;
}

export interface EventSummary {
    id: string;
    type: string;
    created_on: string;
    _links: RetrieveEventsLinks;
}

export interface RetrieveEventsResponseType {
    total_count: number;
    limit: number;
    skip: number;
    from: string;
    to: string;
    data: EventSummary[];
}

export interface EventData {
    id: string;
    action_id: string;
    amount: number;
    currency: number;
    approved: boolean;
    status: string;
    auth_code: string;
    response_code: string;
    response_summary: string;
    '3ds': ThreeDSecureResponse;
    flagged: boolean;
    source: CardSource;
    customer: Customer;
    processed_on: string;
    reference: string;
    metadata: any;
}

export interface Notification {
    id: string;
    url: string;
    success: boolean;
    _links: Link;
}

export interface RetrieveEventResponseType {
    id: string;
    type: string;
    version: string;
    created_on: string;
    data: EventData;
    notifications: Notifications;
    _links: RetrieveEventsLinks;
}

export interface Attempt {
    status_code: number;
    response_body: string;
    retry_mode: string;
    timestamp: string;
}

export interface RetrieveEventNotificationLinks {
    self: Link;
    retry?: Link;
}

export interface RetrieveEventNotificationType {
    id: string;
    url: string;
    success: boolean;
    content_type: ContentType;
    attempts: Attempt[];
    _links: RetrieveEventNotificationLinks[];
}
