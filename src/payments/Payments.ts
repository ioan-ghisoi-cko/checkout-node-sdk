import {
    HttpConfigurationType,
    PaymentRequest,
    Http,
    PaymentResponse,
    Environment,
    DEFAULT_TIMEOUT
} from "../index";

import { ApiTimeout } from "../services/HttpErrors";


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
    configuration: HttpConfigurationType;


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
        this.configuration = http_options;
    }

    public request = async <T>(
        arg: PaymentRequest<T>, idempotency_key = ""
    ): Promise<PaymentResponse> => {
        const http = new Http(this.configuration);
        try {
            const response = await http.send({
                method: "post",
                url: `${this.configuration.environment}/payments`,
                headers: {
                    "Authorization": this.key,
                    "Cko-Idempotency-Key": idempotency_key
                },
                body: { ...arg, metadata: { ...arg.metadata, sdk: "node" } }
            });

            return new PaymentResponse(await response.json);

        } catch (err) {
            throw err;
        }
    };

    // public get = async (
    //     arg: string,
    // ): Promise<PaymentResponse> => {
    //     const http = new Http(this.configuration);
    //     try {
    //         var response = await http.send({
    //             method: 'get',
    //             url: `${this.configuration.environment}/payments`,
    //             authorization: this.key,
    //             body: { ...arg, metadata: { ...arg.metadata, sdk: 'node' } }
    //         });

    //         return new PaymentResponse(await response.json);

    //     } catch (err) {
    //         throw err;
    //     }
    // };
}
