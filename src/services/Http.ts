import fetch from "node-fetch";
import { HttpConfigurationType, DEFAULT_TIMEOUT, HttpRequestParamsType, Environment } from "../index";

/**
 * Http Client Class
 *
 * @export
 * @class Http
 */
export class Http {

    /**
     *  Http request timeout
     *
     * @type {number} Defaults to 5000 if not specified
     * @memberof Http
     */
    public timeout: number;


    /**
     * Creates an instance of Http.
     * @param {HttpConfigurationType} [configuration={ timeout: DEFAULT_TIMEOUT }]
     * @memberof Http
     */
    constructor(public configuration: HttpConfigurationType = { timeout: DEFAULT_TIMEOUT, environment: Environment.Sandbox }) {
        this.timeout = configuration.timeout;
    }


    /**
     * Send HTTP request and handle and return response in the format of {status, json}
     * The {status} reflects the HTTP response code.
     * The {json} reflects the json body of the response
     *
     * @memberof Http
     *
     * @param {HttpRequestParamsType} request
     * @returns {Promise<any>}
     * @throws Throws ValueError or untyped HTTP errors
     */
    public send = async (request: HttpRequestParamsType): Promise<any> => {
        try {
            const response = await fetch(
                request.url,
                {
                    method: request.method,
                    timeout: this.timeout,
                    body: JSON.stringify(request.body),
                    headers: {
                        ...request.headers,
                        "Content-Type": "application/json",
                        "Cache-Control": "no-cache",
                        "pragma": "no-cache"
                    }
                }
            );

            if (!response.ok) {
                throw { status: response.status, json: response.json() };
            }
            // For 'no body' response, replace with empty object
            return response.json()
                .then(data => {
                    return {
                        status: response.status,
                        json: {
                            ...data,
                            headers: {
                                "cko-request-id": response.headers.raw()["cko-request-id"][0],
                                "cko-version": response.headers.raw()["cko-version"][0]
                            }
                        }
                    };
                })
                .catch(err => {
                    return { status: response.status, json: {} };
                });

        } catch (err) {
            throw err;
        }
    }
}
