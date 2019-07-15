import {
    HttpConfigurationType,
    Http,
    Environment,
    DEFAULT_TIMEOUT,
    CreateTokenResponse,
    CardSource,
    ApplePaySource,
    GooglePaySource
} from "../index";
import { determineError } from "../utils/ErrorHandler";
import BaseEndpoint from "./BaseEndpoint";

/**
 * Token class
 *
 * @export
 * @class Tokens
 * @extends {BaseEndpoint}
 */
export default class Tokens extends BaseEndpoint {

    /**
     * Creates an instance of Tokens.
     * @param {key} string public key
     * @param {http_options} HttpConfigurationType
     * @param {HttpConfigurationType.timeout} HttpConfigurationType.timeout HTTP request timeout
     * @param {HttpConfigurationType.environment} HttpConfigurationType.environment default: Sandbox; API Environment
     * @memberof Tokens
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
     * Exchange card details or a digital wallet payment token for a reference token
     * that can be used later to request a card payment.
     *
     * @memberof Tokens
     * @param {source} a payment source
     * @return {Promise<CreateTokenResponse>} A promise to the create token response.
     */
    public request = async (
        source: CardSource | ApplePaySource | GooglePaySource
    ): Promise<CreateTokenResponse> => {
        const http = new Http(this.httpConfiguration);
        try {
            const response = await http.send({
                method: "post",
                url: `${this.httpConfiguration.environment}/tokens`,
                headers: {
                    Authorization: this.key,
                },
                body: source
            });
            return new CreateTokenResponse(await response.json);
        } catch (err) {
            throw await determineError(err);
        }
    };
}
