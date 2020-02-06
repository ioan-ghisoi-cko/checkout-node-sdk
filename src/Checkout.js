import {
    DEFAULT_TIMEOUT,
    LIVE_BASE_URL,
    LIVE_SECRET_KEY_REGEX,
    SANDBOX_BASE_URL,
    SANDBOX_SECRET_KEY_REGEX
} from "./config";
import { Payments, Sources, Tokens } from "./index";

export default class Checkout {
    /**
     * Creates an instance of Checkout.com's SDK.
     *
     * Determines the environemtn based on the key
     *
     * @constructor
     * @param {string} [key] Secret Key /^(sk)
     * @param {Object}  [options] Cofiguration options
     * @memberof Payments
     */
    constructor(key, options) {
        // Set configuration to be use for all services
        this.config = {
            sk: _determineSecretKey(key),
            pk: _determinePublicKey(options),
            host: _determineHost(key, options),
            timeout:
                options && options.timeout ? options.timeout : DEFAULT_TIMEOUT
        };

        this.payments = new Payments(this.config);
        this.sources = new Sources(this.config);
        this.tokens = new Tokens(this.config);
    }
}

const _determineHost = (key, options) => {
    // Unless specified, determine the hosted based on the secret key
    if (options && options.host) {
        return options.host;
    } else {
        return LIVE_SECRET_KEY_REGEX.test(key)
            ? LIVE_BASE_URL
            : SANDBOX_BASE_URL;
    }
};

const _determineSecretKey = key => {
    // Unless specified, check environemtn variables for the key
    return !key ? process.env.CKO_SECRET_KEY || "" : key;
};

const _determinePublicKey = options => {
    // Unless specified, check environemtn variables for the key
    if (options && options.pk) {
        return options.pk;
    } else {
        return process.env.CKO_PUBLIC_KEY || "";
    }
};
