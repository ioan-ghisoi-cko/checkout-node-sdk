import _payments from "./api/Payments";
import _sources from "./api/Sources";
import _tokens from "./api/Tokens";
import { Environment, HttpConfigurationType } from "./index";
import { DEFAULT_TIMEOUT } from "./config/Constants";


/**
 * Checkout.com Node SDK Main Class
 *
 * @export
 * @class Checkout
 */
export default class Checkout {

    /**
     * Handle the payments endpoint
     *
     * @type {_payments}
     * @memberof Checkout
     */
    public payments: _payments;

    /**
     * Handle the sources endpoint
     *
     * @type {sources}
     * @memberof Checkout
     */
    public sources: _sources;


    /**
     * Handle the tokens endpoint
     *
     * @type {_tokens}
     * @memberof Checkout
     */
    public tokens: _tokens;


    /**
     * The api key
     *
     * @type {string}
     * @memberof Checkout
     */
    public key: string;



    /**
     * The API HTTP configuration
     *
     * @type {HttpConfigurationType}
     * @memberof Checkout
     */
    public httpConfiguration: HttpConfigurationType = {
        environment: Environment.Sandbox,
        timeout: DEFAULT_TIMEOUT
    };


    /**
     * Creates an instance of Checkout.
     *
     * @param {string} [key=""]
     * @memberof Checkout
     */
    constructor(key = "") {
        this.key = key;
        this.payments = new _payments(key || "", this.httpConfiguration);
        this.sources = new _sources(key || "", this.httpConfiguration);
        this.tokens = new _tokens("", this.httpConfiguration);
    }


    /**
     * Secret Key setter
     *
     * @memberof Checkout
     */
    public setSecretKey = (key: string) => {
        this.key = key;
        this.payments.key = key;
        this.sources.key = key;
    };


    /**
     * Public Key setter
     *
     * @memberof Checkout
     */
    public setPublicKey = (key: string) => {
        this.tokens.key = key;
    };


    /**
     * Http Configuration setter
     *
     * @param {http_options} HttpConfigurationType
     * @param {HttpConfigurationType.timeout} HttpConfigurationType.timeout HTTP request timeout
     * @param {HttpConfigurationType.environment} HttpConfigurationType.environment default: Sandbox; API Environment
     * @memberof Checkout
     */
    public setHttpConfiguration = (httpConfiguration: HttpConfigurationType) => {
        this.httpConfiguration = httpConfiguration;
        this.payments.httpConfiguration = httpConfiguration;
        this.sources.httpConfiguration = httpConfiguration;
        this.tokens.httpConfiguration = httpConfiguration;
    };
}
