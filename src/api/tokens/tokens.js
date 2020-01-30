import { determineError } from "../../services/errors";
import fetch from "node-fetch";
import http from "../../services/http";
import { setTokenType } from "../../services/validation";

export default class Tokens {
    constructor(config) {
        this.config = config;
    }

    async request(body) {
        setTokenType(body);
        try {
            const response = await http(
                fetch,
                { timeout: this.config.timeout },
                {
                    method: "post",
                    url: `${this.config.host}/tokens`,
                    headers: { Authorization: this.config.pk },
                    body
                }
            );

            const json = await response.json;
            return json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }
}
