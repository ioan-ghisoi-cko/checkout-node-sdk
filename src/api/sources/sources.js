import { determineError } from "../../services/errors";
import fetch from "node-fetch";
import http from "../../services/http";
import { setSourceType } from "../../services/validation";
const pjson = require("../../../package.json");

export default class Sources {
    constructor(config) {
        this.config = config;
    }

    async add(body) {
        setSourceType(body);
        try {
            const response = await http(
                fetch,
                { timeout: this.config.timeout },
                {
                    method: "post",
                    url: `${this.config.host}/sources`,
                    headers: { Authorization: this.config.sk },
                    body
                }
            );
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }
}
