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
export type ContentType = "json" | "xml";
export type RequestType = "get" | "post" | "put" | "patch" | "delete";
export type CardCategoryType = "Credit" | "Debit" | "Prepaid";
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

export interface PaymentHeaders {
    "cko-request-id": string;
    "cko-version": string;
}

export interface PaymentRequest<T, S> {
    source?: T;
    destination?: S;
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
    risk?: RiskRequest;
    success_url?: string;
    failure_url?: string;
    payment_ip?: string;
    recipient?: Recipient;
    processing?: Processing;
    metadata?: Metadata;
}

export interface CardSourceType {
    number: string;
    expiry_month: number;
    expiry_year: number;
    name?: string;
    cvv?: string;
    stored?: boolean;
    billing_address?: Address;
    phone?: Phone;
}

export interface TokenSourceType {
    token: string;
    billing_address?: Address;
    phone?: Phone;
}

export interface IdSourceType {
    id: string;
    cvv?: string;
}

export interface CustomerSourceType {
    id?: string;
    email?: string;
}

export interface NetworkTokenSourceType {
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
}

export interface BoletoSourceType {
    birthDate: string;
    cpf: string;
    customerName: string;
}

export interface BancontactSourceType {
    payment_country: string;
    account_holder_name: string;
    billing_descriptor?: string;
}

export interface EpsSourceType {
    purpose: string;
    bic?: string;
}

export interface FawryProduct {
    product_id: string;
    quantity: number;
    price: number;
    description: string;
}

export interface FawrySourceType {
    description: string;
    customer_profile_id?: string;
    customer_email: string;
    customer_mobile: string;
    expires_on?: string;
    products: FawryProduct[];
}

export interface KlarnaAddress {
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
}


export interface KlarnaProductIdentifiers {
    category_path?: string;
    global_trade_item_number?: string;
    manufacturer_part_number?: string;
    brand?: string;
}

export interface KlarnaProductDimensions {
    height?: number;
    width?: string;
    length?: string;
}

export interface KlarnaShippingAttributes {
    weight?: number;
    dimensions?: KlarnaProductDimensions;
    tags?: string[];
}

export interface KlarnaProduct {
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
}

export interface KlarnaCustomer {
    date_of_birth?: string;
    type?: string;
    organization_registration_id?: string;
    gender?: string;
}

export interface KlarnaSourceType {
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
}

export type KnetLanguage = "ar" | "en";

export interface KnetSourceType {
    language: KnetLanguage;
    user_defined_field1?: string;
    user_defined_field2?: string;
    user_defined_field3?: string;
    user_defined_field4?: string;
    user_defined_field5?: string;
    card_token?: string;
    ptlf?: string;
}

export interface QpaySourceType {
    quantity?: number;
    description: string;
    language?: string;
    national_id?: string;
}

export interface InfoField {
    label: string;
    text: string;
}

export interface InfoFields {
    [key: string]: InfoField;
}

export interface GiropaySourceType {
    purpose: string;
    bic?: string;
    iban?: string;
    info_fields?: InfoFields;
}

export interface IdealSourceType {
    description: string;
    bic: string;
    language?: string;
}

export interface QiwiSourceType {
    walletId: string;
}

export interface AddSourceResponseType {
    id: string;
    type: string;
    response_code: string;
    customer?: Customer;
    response_data: SepaMandateReference;
    _links: AddSourceLinks;
}

export interface DestinationResponse {
    id?: string;
    billing_address?: Address;
    phone?: Phone;
    expiry_month: number;
    expiry_year: number;
    name?: string;
    scheme?: string;
    last4: string;
    fingerprint: string;
    bin: string;
    card_type?: string;
    card_category?: CardCategoryType;
    issuer: string;
    issuer_country: string;
    product_id: string;
    product_type: string;
}

export interface PaymentResponseType {
    headers: PaymentHeaders;
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
    destination?: DestinationResponse;
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

export interface RiskRequest {
    enabled: boolean;
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
    metadata: Metadata;
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
    card_category: CardCategoryType;
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

export interface GetDisputesLinks {
    self: Link;
    evidence?: Link;
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
    "3ds": ThreeDSecureResponse;
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

export interface TokenDestinationType {
    token: string;
    first_name: string;
    last_name: string;
    billing_address?: Address;
    phone?: Phone;
}

export interface IdDestinationType {
    id: string;
    first_name: string;
    last_name: string;
}

export interface CardDestinationType {
    number: string;
    expiry_month: number;
    expiry_year: number;
    first_name: string;
    last_name: string;
    name?: string;
    billing_address?: Address;
    phone?: Phone;
}

export interface GetDisputesParams {
    limit?: number;
    skip?: number;
    from?: string;
    to?: string;
    id?: string;
    statuses?: string;
    payment_id?: string;
    payment_reference?: string;
    payment_arn?: string;
    this_channel_only?: boolean;
}

export interface DisputeSummary {
    id?: string;
    category?: string;
    from?: string;
    status?: string;
    amount?: number;
    currency?: string;
    payment_id?: string;
    payment_reference?: string;
    payment_arn?: string;
    payment_method?: string;
    evidence_required_by?: string;
    received_on?: string;
    last_update?: string;
    _links?: GetDisputesLinks;
}

export interface GetDisputesResponseType {
    limit: number;
    skip: number;
    from: string;
    to: string;
    id: string;
    statuses: string;
    payment_id: string;
    payment_reference: string;
    payment_arn: string;
    this_channel_only: boolean;
    total_count: boolean;
    data: DisputeSummary[];
}

export type DisputeStatus = "received" | "evidence_required" | "evidence_under_review" | "resolved" | "closed" | "won" | "lost" | "canceled" | "accepted";
export type DisputeCategory = "fraudulent" | "unrecognized" | "canceled_recurring" | "product_service_not_received" | "not_as_described" | "credit_not_issued" | "duplicate" | "incorrect_amount" | "general";
export type DisputeItems = "proof_of_delivery_or_service" | "invoice_or_receipt" | "invoice_showing_distinct_transactions" | "customer_communication" | "refund_or_cancellation_policy" | "proof_of_delivery_or_service_date" | "recurring_transaction_agreement" | "additional_evidence";

export interface DisputePayment {
    id: string;
    amount: string;
    currency: string;
    method: string;
    arn: string;
    processed_on: string;
}

export interface GetDisputesDetailsResponseType {
    id: string;
    category: DisputeCategory;
    amount: number;
    currency: string;
    reason_code: string;
    status: DisputeStatus;
    relevant_evidence: [any];
    items: DisputeItems;
    evidence_required_by: string;
    received_on: string;
    last_update: boolean;
    payment: DisputePayment;
    _links: GetDisputesLinks;
}

export interface ProvideDisputesEvidenceRequestType {
    id: string;
    proof_of_delivery_or_service_file?: string;
    proof_of_delivery_or_service_text?: string;
    invoice_or_receipt_file?: string;
    invoice_or_receipt_text?: string;
    invoice_showing_distinct_transactions_file?: string;
    invoice_showing_distinct_transactions_text?: string;
    customer_communication_file?: string;
    customer_communication_text?: string;
    refund_or_cancellation_policy_file?: string;
    refund_or_cancellation_policy_text?: string;
    recurring_transaction_agreement_file?: string;
    recurring_transaction_agreement_text?: string;
    additional_evidence_file?: string;
    additional_evidence_text?: string;
    proof_of_delivery_or_service_date_file?: string;
    proof_of_delivery_or_service_date_text?: string;
}

export interface GetDisputeEvidenceResponseType {
    proof_of_delivery_or_service_file: string;
    proof_of_delivery_or_service_text: string;
    proof_of_delivery_or_service_date_text: string;
}

export interface UploadFileLinks {
    self: Link;
}
export interface GetFileInfoLinks extends UploadFileLinks {
    self: Link;
    download: Link;
}


export interface UploadFileResponseType {
    id: string;
    _links: UploadFileLinks;
}

export interface GetFileInfoResponseType {
    id: string;
    filename: string;
    purpose: string;
    size: number;
    uploaded_on: string;
    _links: GetFileInfoLinks;
}

export interface SubmitEvidenceResponseType {
    id: string;
    _links: UploadFileLinks;
}

export interface SubmitEvidenceType {
    path: string;
    purpose: string;
}

export interface GetPaymentsType {
    path: string;
    purpose: string;
}

export interface ReconcilePaymentResponseType {
    count: number;
    data: ReconciledPayment[];
    _links: UploadFileLinks;
}

export interface ReconciledPayment {
    id: string;
    processing_currency: string;
    payout_currency: string;
    requested_on: string;
    channel_name: string;
    reference: string;
    payment_method: string;
    card_type: string;
    card_category: string;
    issuer_country: string;
    merchant_country: string;
    mid: string;
    actions: ReconciledPaymentAction[];
}

export interface ReconciledPaymentAction {
    type: string;
    id: string;
    processed_on: string;
    response_code: string;
    response_description: string;
    breakdown: ReconciledPaymentBreakdown[];
}

export interface ReconciledPaymentBreakdown {
    type: string;
    date: string;
    processing_currency_amount: string;
    payout_currency_amount: string;
}

export interface ReconcilePaymentsType {
    from?: string;
    to?: string;
    reference?: string;
}

export interface ReconcilePaymentsResponseType {
    from?: string;
    to?: string;
    reference?: string;
}
