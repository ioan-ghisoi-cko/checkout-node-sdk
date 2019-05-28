import fetch from "node-fetch";
import {
    HttpRequestParams,
    HttpConfiguration,
    ValueError,
    // CheckoutConfiguration
} from "../index";

let start_time = new Date().getTime();

export class Http {
    constructor(public configuration: HttpConfiguration) { }

    public send = async (request: HttpRequestParams): Promise<any> => {
        try {
            const response = await fetch(
                this.configuration.environment + request.path,
                {
                    method: request.method,
                    timeout: this.configuration.timeout,
                    body: JSON.stringify(request.body),
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: request.authorization
                    }
                }
            );
            return await { status: response.status, json: response.json() };
        } catch (err) {
            if (this.configuration === undefined) {
                throw new ValueError('Invalid configuration');
            }
            throw err
        }
    }
}
