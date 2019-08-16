import _payments from "./api/Payments";
import _sources from "./api/Sources";
import _tokens from "./api/Tokens";
import _webhooks from "./api/Webhooks";
import _events from "./api/Events";
import _disputes from "./api/Disputes";
import _reconciliation from "./api/Reconciliation";

import { Environment, HttpConfigurationType } from "./index";
import { DEFAULT_TIMEOUT, LIVE_SECRET_KEY_REGEX, LIVE_PUBLIC_KEY_REGEX } from "./config/Constants";


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
     * Handle the webhooks endpoint
     *
     * @type {_webhooks}
     * @memberof Checkout
     */
    public webhooks: _webhooks;

    /**
     * Handle the events endpoint
     *
     * @type {_events}
     * @memberof Checkout
     */
    public events: _events;

    /**
     * Handle the disputes endpoint
     *
     * @type {_disputes}
     * @memberof Checkout
     */
    public disputes: _disputes;

    /**
     * Handle the reconciliation endpoint
     *
     * @type {_reconciliation}
     * @memberof Checkout
     */
    public reconciliation: _reconciliation;

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
        this.httpConfiguration.environment = LIVE_SECRET_KEY_REGEX.test(key) ? Environment.Live : Environment.Sandbox;
        this.payments = new _payments(key || "", this.httpConfiguration);
        this.sources = new _sources(key || "", this.httpConfiguration);
        this.tokens = new _tokens("", this.httpConfiguration);
        this.webhooks = new _webhooks("", this.httpConfiguration);
        this.events = new _events("", this.httpConfiguration);
        this.disputes = new _disputes("", this.httpConfiguration);
        this.reconciliation = new _reconciliation("", this.httpConfiguration);
    }

    /**
     * Secret Key setter
     *
     * @memberof Checkout
     */
    public setSecretKey = (key: string) => {
        this.key = key;
        this.httpConfiguration.environment = LIVE_SECRET_KEY_REGEX.test(key) ? Environment.Live : Environment.Sandbox;
        this.payments.key = key;
        this.sources.key = key;
        this.webhooks.key = key;
        this.events.key = key;
        this.disputes.key = key;
        this.reconciliation.key = key;
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
        this.webhooks.httpConfiguration = httpConfiguration;
        this.events.httpConfiguration = httpConfiguration;
        this.disputes.httpConfiguration = httpConfiguration;
        this.reconciliation.httpConfiguration = httpConfiguration;
    };
}
