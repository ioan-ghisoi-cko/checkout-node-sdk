var pjson = require('../../package.json');

import {
    HttpConfigurationType,
    PaymentRequest,
    Http,
    PaymentResponse,
    GetPaymentResponse,
    GetPaymentActionsResponseType,
    Environment,
    DEFAULT_TIMEOUT,
    PaymentActionResponse,
    CaptureActionBody,
    RefundActionBody,
    VoidActionBody
} from "../index";
import { determineError } from "../utils/ErrorHandler";
import { performRequest } from "../utils/RequestHandler";
import BaseEndpoint from "./BaseEndpoint";

/**
 * Payment request class
 *
 * @export
 * @class Payments
 */
export default class Payments extends BaseEndpoint {

    /**
     * Creates an instance of Payments.
     *
     * @param {string} key
     * @param {http_options} HttpConfigurationType
     * @param {HttpConfigurationType.timeout} HttpConfigurationType.timeout HTTP request timeout
     * @param {HttpConfigurationType.environment} HttpConfigurationType.environment default: Sandbox; API Environment
     * @memberof Payments
     */
    constructor(
        key: string,
        http_options: HttpConfigurationType = {
            timeout: DEFAULT_TIMEOUT, environment: Environment.Sandbox
        }
    ) {
        super(key, http_options);
    }


    /**
     * Sends payment requests with a dynamic source object.
     *
     * Just specify the source or destination of the payment using the source.type
     * or destination.type field, along with the source- or destination-specific data.
     *
     * @memberof Payments
     * @param {arg} PaymentRequest<T>
     * @return {Promise<PaymentResponse>} A promise to payment response.
     */
    public request = async <T, S = {}>(
        arg: PaymentRequest<T, S>, idempotency_key = ""
    ): Promise<PaymentResponse> => {
        return new PaymentResponse(await performRequest({
            config: this.httpConfiguration,
            method: "post",
            url: `${this.httpConfiguration.environment}/payments`,
            headers: {
                "Authorization": this.key,
                "Cko-Idempotency-Key": idempotency_key
            },
            body: { ...arg, metadata: { ...arg.metadata, sdk: "node", sdk_version: pjson.version } }
        }));
    };


    /**
     * Returns the details of the payment with the specified identifier string.
     *
     * @memberof Payments
     * @param {id}  /^(pay|sid)_(\w{26})$/ The payment or payment session identifier.
     * @return {Promise<GetPaymentResponse>} A promise to payment details response.
     */
    public get = async (
        id: string,
    ): Promise<GetPaymentResponse> => {
        return new GetPaymentResponse(await performRequest({
            config: this.httpConfiguration,
            method: "get",
            url: `${this.httpConfiguration.environment}/payments/${id}`,
            headers: {
                "Authorization": this.key,
            }
        }));
    };

    /**
     * Returns all the actions associated with a payment ordered by processing date in descending order (latest first).
     *
     * @memberof Payments
     * @param {id}  /^(pay)_(\w{26})$/ The payment identifier
     * @return {Promise<GetPaymentActionsResponseType>} A promise to payment actions response.
     */
    public getActions = async (
        id: string,
    ): Promise<GetPaymentActionsResponseType> => {
        return performRequest({
            config: this.httpConfiguration,
            method: "get",
            url: `${this.httpConfiguration.environment}/payments/${id}/actions`,
            headers: {
                "Authorization": this.key,
            }
        });
    };

    /**
     * Captures a payment if supported by the payment method.
     *
     * @memberof Payments
     * @param {paymentId}  /^(pay)_(\w{26})$/ The payment identifier.
     * @param {body}  CaptureActionBody Additional details about the capture request.
     * @param {CaptureActionBody.amount} number>=0 The amount to capture in the major currency. If not specified, the full payment amount will be captured.
     * @param {CaptureActionBody.reference} string A reference you can later use to identify this capture request.
     * @param {CaptureActionBody.metadata} object Set of key/value pairs that you can attach to the capture request. It can be useful for storing additional information in a structured format
     * @return {Promise<PaymentActionResponse>} A promise to payment actions response.
     */
    public capture = async (
        paymentId: string,
        body?: CaptureActionBody
    ): Promise<PaymentActionResponse> =>
        new PaymentActionResponse(await performRequest({
            config: this.httpConfiguration,
            method: "post",
            url: `${this.httpConfiguration.environment}/payments/${paymentId}/captures`,
            headers: {
                "Authorization": this.key,
            },
            body: body !== undefined ? body : {}
        }));

    /**
     * Refunds a payment if supported by the payment method.
     *
     * @memberof Payments
     * @param {paymentId}  /^(pay)_(\w{26})$/ The payment identifier.
     * @param {body}  RefundActionBody Additional details about the refund request.
     * @param {RefundActionBody.amount} number>=0 The amount to refund in the major currency. If not specified, the full payment amount will be refunded.
     * @param {RefundActionBody.reference} string A reference you can later use to identify this capture request.
     * @param {RefundActionBody.metadata} object Set of key/value pairs that you can attach to the capture request. It can be useful for storing additional information in a structured format
     * @return {Promise<PaymentActionResponse>} A promise to payment actions response.
     */
    public refund = async (
        paymentId: string,
        body?: RefundActionBody
    ): Promise<PaymentActionResponse> =>
        new PaymentActionResponse(await performRequest({
            config: this.httpConfiguration,
            method: "post",
            url: `${this.httpConfiguration.environment}/payments/${paymentId}/refunds`,
            headers: {
                "Authorization": this.key,
            },
            body: body !== undefined ? body : {}
        }));


    /**
     * Voids a payment if supported by the payment method.
     *
     * @memberof Payments
     * @param {paymentId}  /^(pay)_(\w{26})$/ The payment identifier.
     * @param {body}  VoidActionBody Additional details about the void request.
     * @param {RefundActionBody.reference} string A reference you can later use to identify this capture request.
     * @param {RefundActionBody.metadata} object Set of key/value pairs that you can attach to the capture request. It can be useful for storing additional information in a structured format
     * @return {Promise<PaymentActionResponse>} A promise to payment actions response.
     */
    public void = async (
        paymentId: string,
        body?: VoidActionBody
    ): Promise<PaymentActionResponse> =>
        new PaymentActionResponse(await performRequest({
            config: this.httpConfiguration,
            method: "post",
            url: `${this.httpConfiguration.environment}/payments/${paymentId}/voids`,
            headers: {
                "Authorization": this.key,
            },
            body: body !== undefined ? body : {}
        }));
}
