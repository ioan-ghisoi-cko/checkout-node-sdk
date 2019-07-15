import {
    HttpConfigurationType,
    Environment,
    DEFAULT_TIMEOUT
} from "../index";

/**
 * The base class for API endpoints in the Unified Payments API
 *
 * @export
 * @class BaseEndpoint
 */
export default class BaseEndpoint {

    /**
     * The key used in the authorisation header for requests
     * made to the Unified Payments API.
     *
     * @type {string}
     * @memberof BaseEndpoint
     */
    public key: string;

    /**
     *
     *
     * @type {HttpConfigurationType}
     * @memberof BaseEndpoint
     */
    public httpConfiguration: HttpConfigurationType;


    /**
     * Creates an instance of BaseEndpoint.
     * @param {string} key
     * @param {HttpConfigurationType} [http_options={
     *             timeout: DEFAULT_TIMEOUT, environment: Environment.Sandbox
     *         }]
     * @memberof BaseEndpoint
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
}
