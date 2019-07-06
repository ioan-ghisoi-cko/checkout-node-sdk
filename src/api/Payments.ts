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
    VoidActionBody,
    RequestType
} from "../index";
import { determineError } from "../utils/ErrorHandler";

/**
 * Payment request class
 *
 * @export
 * @class Payments
 */
export default class Payments {

    /**
     * The auth key needed in the HTTP calls to the
     * Checkout.com Unified Payments API
     *
     * This key is used in the 'Authorisation Header'
     *
     * @type {string}
     * @memberof Payments
     */
    key: string;

    /**
     * Http configuration needed in the HTTP requests
     * made the the Checkout.com Unified Payments API
     *
     * @type {string}
     * @memberof Payments
     */
    httpConfiguration: HttpConfigurationType;


    /**
     * Creates an instance of Payments.
     *
     * @param {string} key
     * @param {HttpConfigurationType} http_options
     * @memberof Payments
     */
    constructor(
        key: string,
        http_options: HttpConfigurationType = {
            timeout: DEFAULT_TIMEOUT, environment: Environment.Sandbox
        }
    ) {
        this.key = key;
        this.httpConfiguration = http_options;
    }

    public request = async <T>(
        arg: PaymentRequest<T>, idempotency_key = ""
    ): Promise<PaymentResponse> => {
        const http = new Http(this.httpConfiguration);
        try {
            const response = await http.send({
                method: "post",
                url: `${this.httpConfiguration.environment}/payments`,
                headers: {
                    Authorization: this.key,
                    "Cko-Idempotency-Key": idempotency_key
                },
                body: { ...arg, metadata: { ...arg.metadata, sdk: "node" } }
            });

            return new PaymentResponse(await response.json);

        } catch (err) {
            throw await determineError(err);
        }
    };

    public get = async (
        id: string,
    ): Promise<GetPaymentResponse> => {
        const http = new Http(this.httpConfiguration);
        try {
            const response = await http.send({
                method: "get",
                url: `${this.httpConfiguration.environment}/payments/${id}`,
                headers: {
                    Authorization: this.key
                },
            });

            return new GetPaymentResponse(await response.json);

        } catch (err) {
            throw await determineError(err);
        }
    };

    public getActions = async (
        id: string,
    ): Promise<GetPaymentActionsResponseType> => {
        const http = new Http(this.httpConfiguration);
        try {
            const response = await http.send({
                method: "get",
                url: `${this.httpConfiguration.environment}/payments/${id}/actions`,
                headers: {
                    Authorization: this.key
                },
            });

            return await response.json;

        } catch (err) {
            throw await determineError(err);
        }
    };

    public capture = async (
        paymentId: string,
        body?: CaptureActionBody
    ): Promise<PaymentActionResponse> => this._actionHandler("captures", paymentId, body);

    public refund = async (
        paymentId: string,
        body?: RefundActionBody
    ): Promise<PaymentActionResponse> => this._actionHandler("refunds", paymentId, body);

    public void = async (
        paymentId: string,
        body?: VoidActionBody
    ): Promise<PaymentActionResponse> => this._actionHandler("voids", paymentId, body);

    private _actionHandler = async (
        action: string,
        paymentId: string,
        body?: VoidActionBody,
    ): Promise<PaymentActionResponse> => {
        const http = new Http(this.httpConfiguration);
        try {
            const response = await http.send({
                method: "post",
                url: `${this.httpConfiguration.environment}/payments/${paymentId}/${action}`,
                headers: {
                    Authorization: this.key
                },
                body: body !== undefined ? body : {}
            });

            return new PaymentActionResponse(await response.json);

        } catch (err) {
            throw await determineError(err);
        }
    }
}
