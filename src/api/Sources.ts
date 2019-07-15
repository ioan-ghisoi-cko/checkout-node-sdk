import {
    HttpConfigurationType,
    Http,
    AddSourceResponse,
    Environment,
    DEFAULT_TIMEOUT,
    SourceRequest
} from "../index";
import { determineError } from "../utils/ErrorHandler";
import BaseEndpoint from "./BaseEndpoint";


/**
 * Payment source class
 *
 * @export
 * @class Sources
 * @extends {BaseEndpoint}
 */
export default class Sources extends BaseEndpoint {

    /**
     * Creates an instance of Sources.
     * @param {string} key
     * @param {http_options} HttpConfigurationType
     * @param {HttpConfigurationType.timeout} HttpConfigurationType.timeout HTTP request timeout
     * @param {HttpConfigurationType.environment} HttpConfigurationType.environment default: Sandbox; API Environment
     * @memberof Sources
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
     * Add a reusable payment source that can be used later to make one or more payments.
     * Payment sources are linked to a specific customer and cannot be shared between customers.
     *
     * @memberof Payments
     * @param {source} SourceRequest
     * @return {Promise<AddSourceResponse>} A promise to the add source response.
     */
    public add = async (
        source: SourceRequest
    ): Promise<AddSourceResponse> => {
        const http = new Http(this.httpConfiguration);
        try {
            const response = await http.send({
                method: "post",
                url: `${this.httpConfiguration.environment}/sources`,
                headers: {
                    Authorization: this.key,
                },
                body: source
            });
            return new AddSourceResponse(await response.json);
        } catch (err) {
            throw await determineError(err);
        }
    };
}
