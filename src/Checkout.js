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
        let host = "";
        let pk = "";
        let sk = "";

        sk = !key ? process.env.CKO_SECRET_KEY || "" : key;
        pk = process.env.CKO_PUBLIC_KEY || "";

        if (
            sk &&
            !LIVE_SECRET_KEY_REGEX.test(sk) &&
            !SANDBOX_SECRET_KEY_REGEX.test(sk)
        ) {
            throw new Error("Invalid Secret Key");
        }

        // if the host is not specified, determine it based on the key
        if (options && options.host) {
            host = options.host;
        } else {
            host = LIVE_SECRET_KEY_REGEX.test(key)
                ? LIVE_BASE_URL
                : SANDBOX_BASE_URL;
        }

        this.config = {
            sk,
            pk,
            host,
            timeout:
                options && options.timeout ? options.timeout : DEFAULT_TIMEOUT
        };

        this.payments = new Payments(this.config);
        this.sources = new Sources(this.config);
        this.tokens = new Tokens(this.config);
    }
}
