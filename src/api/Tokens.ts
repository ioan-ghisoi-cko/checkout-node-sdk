import {
    HttpConfigurationType,
    Http,
    AddSourceResponse,
    Environment,
    DEFAULT_TIMEOUT,
    CreateTokenResponse
} from "../index";
import { determineError } from "../utils/ErrorHandler";
import { CardSource, ApplePaySource, GooglePaySource } from "../models/request";

export default class Tokens {

    key: string;

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

    public request = async <T>(
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
