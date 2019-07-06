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

export default class Sources extends BaseEndpoint {

    constructor(
        key: string,
        http_options: HttpConfigurationType = {
            timeout: DEFAULT_TIMEOUT, environment: Environment.Sandbox
        }
    ) {
        super(key, http_options);
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
