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
import BaseEndpoint from "./BaseEndpoint";

export default class Tokens extends BaseEndpoint {

    constructor(
        key: string,
        http_options: HttpConfigurationType = {
            timeout: DEFAULT_TIMEOUT, environment: Environment.Sandbox
        }
    ) {
        super(key, http_options);
    }

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
