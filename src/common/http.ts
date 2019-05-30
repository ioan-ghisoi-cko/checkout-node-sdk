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
                        "Authorization": request.authorization
                    }
                }
            );
            let http_status = response.status;
            // Check response and if it's body is not present replace body with empty object
            return response.json()
                .then(data => {
                    return {
                        status: http_status, json: data
                    }
                })
                .catch(err => {
                    return {
                        status: http_status, json: {}
                    }
                })

        } catch (err) {
            if (this.configuration === undefined) {
                throw new ValueError('Invalid configuration');
            }
            throw err
        }
    }
}
