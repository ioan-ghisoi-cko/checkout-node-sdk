import {
    HttpConfigurationType,
    Http,
    AddSourceResponse,
    Environment,
    DEFAULT_TIMEOUT,
    SourceRequest
} from "../index";
import { determineError } from "../utils/ErrorHandler";

export default class Sources {

    key: string;

    /**
     * Http configuration needed in the HTTP requests
     * made the the Checkout.com Unified Payments API
     *
     * @type {string}
     * @memberof Payments
     */
    httpConfiguration: HttpConfigurationType;


    constructor(
        key: string,
        http_options: HttpConfigurationType = {
            timeout: DEFAULT_TIMEOUT, environment: Environment.Sandbox
        }
    ) {
        this.key = key;
        this.httpConfiguration = http_options;
    }

    public add = async <T>(
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
