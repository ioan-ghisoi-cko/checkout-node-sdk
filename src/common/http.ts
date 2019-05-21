import fetch from "node-fetch";
import {
    HttpPost,
    HttpGet,
    Configuration
} from "../index";

/**
 * Http Client
 *
 * @export
 * @class Http
 */
export class Http {
    /**
     *
     *
     * @private
     * @type {Configuration}
     * @memberof Http
     */
    private configuration: Configuration;

    /**
     * Creates an instance of Http.
     * @param {Configuration} [configuration={
     *   retries: Configuration.DEFAULT_RETRIES,
     *   timeout: Configuration.DEFAULT_TIMEOUT
     *  }]
     * @memberof Http
     */
    public constructor(
        configuration: Configuration = {
            retries: Configuration.DEFAULT_RETRIES,
            timeout: Configuration.DEFAULT_TIMEOUT
        }) {
        this.configuration = configuration;
    }

    /**
     * HTTP POST Request $configuration
     * @return {Promise<any>}
     */
    public post = async (request: HttpPost): Promise<any> => {
        try {
            const response = await fetch(
                request.url,
                {
                    method: "post",
                    timeout: request.http_configuration !== undefined ? request.http_configuration.timeout : this.configuration.timeout,
                    body: JSON.stringify(request.body),
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: request.key
                    }
                }
            );
            return await { status: response.status, json: response.json() };
        } catch (err) {
            if (request.http_configuration === undefined || request.http_configuration.retries === undefined) {
                throw err;
            } else if (request.http_configuration.retries === 1 || request.http_configuration.retries < 1) throw err;
            return await this.post({ ...request, http_configuration: { ...request.http_configuration, retries: request.http_configuration.retries - 1 } });
        }
    };

    /**
     * HTTP GET Request $configuration
     * @return {Promise<any>}
     */
    public get = async (request: HttpGet): Promise<any> => {
        try {
            const response = await fetch(
                request.url,
                {
                    method: "get",
                    timeout: request.http_configuration !== undefined ? request.http_configuration.timeout : this.configuration.timeout,
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: request.key
                    }
                }
            );
            return await { status: response.status, json: response.json() };
        } catch (err) {
            if (request.http_configuration === undefined || request.http_configuration.retries === undefined) {
                throw err;
            } else if (request.http_configuration.retries === 1 || request.http_configuration.retries < 1) throw err;
            return await this.get({ ...request, http_configuration: { ...request.http_configuration, retries: request.http_configuration.retries - 1 } });
        }
    };

    /**
     * Getter $configuration
     * @return {Configuration}
     */
    public getConfiguration(): Configuration {
        return this.configuration;
    }

    /**
     * Setter $configuration
     * @param {Configuration} value
     */
    public setConfiguration(value: Configuration) {
        this.configuration = value;
    }
}
