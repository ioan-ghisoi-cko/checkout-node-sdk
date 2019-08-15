import {
    HttpConfigurationType,
    Http,
    Environment,
    DEFAULT_TIMEOUT,
    ReconcilePaymentResponse,
    ReconcilePaymentsResponseType
} from "../index";
import {
    GetDisputesResponse,
    GetDisputeDetailsResponse,
} from "../models/response/index";
import { determineError } from "../utils/ErrorHandler";
import BaseEndpoint from "./BaseEndpoint";

const querystring = require("querystring");

export default class Reconciliation extends BaseEndpoint {

    /**
     * Creates an instance of Reconciliation.
     * @param {string} key
     * @param {http_options} HttpConfigurationType
     * @param {HttpConfigurationType.timeout} HttpConfigurationType.timeout HTTP request timeout
     * @param {HttpConfigurationType.environment} HttpConfigurationType.environment default: Sandbox; API Environment
     * @memberof Events
     */
    constructor(
        key: string,
        http_options: HttpConfigurationType = {
            timeout: DEFAULT_TIMEOUT, environment: Environment.Live
        }
    ) {
        super(key, http_options);
    }

    /**
     * Returns the reconciled a payment details
     *
     * @memberof Reconciliation
     * @param {id}  string Payment id
     * @return {Promise<ReconcilePaymentResponse>} A promise to the reconcile payment response.
     */
    public getPayment = async (id: string): Promise<ReconcilePaymentResponse> => {
        try {
            const get = await this._getHandler(`${this.httpConfiguration.environment}/reporting/payments/${id}`);
            return new ReconcilePaymentResponse(await get.json);
        } catch (err) {
            throw await determineError(err);
        }
    };

    /**
     * Returns the reconciled a payment details
     *
     * @memberof Reconciliation
     * @param {arg}  ReconcilePaymentsResponseType Filters
     * @return {Promise<ReconcilePaymentResponse>} A promise to the reconcile payment response.
     */
    public getPayments = async (arg?: ReconcilePaymentsResponseType): Promise<ReconcilePaymentResponse> => {
        try {
            // build query params
            const params = querystring.stringify(arg).length > 0 ? `?${querystring.stringify(arg)}` : "";
            const get = await this._getHandler(`${this.httpConfiguration.environment}/reporting/payments${params}`);
            return new ReconcilePaymentResponse(await get.json);
        } catch (err) {
            throw await determineError(err);
        }
    };

    /**
     * Handle all GET requests to remove duplication
     *
     * @private
     * @memberof Events
     */
    private _getHandler = async (
        url: string,
    ): Promise<any> => {
        const http = new Http(this.httpConfiguration);
        return http.send({
            method: "get",
            url,
            headers: {
                Authorization: this.key
            },
        });
    }
}
