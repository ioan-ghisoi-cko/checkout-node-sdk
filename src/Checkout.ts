import _payments from "./api/Payments";
import _sources from "./api/Sources";
import _tokens from "./api/Tokens";
import { Environment, HttpConfigurationType } from "./index";
import { DEFAULT_TIMEOUT } from "./config/Constants";

export default class Checkout {
    public payments: _payments;
    public sources: _sources;
    public tokens: _tokens;
    public key: string;

    public httpConfiguration: HttpConfigurationType = {
        environment: Environment.Sandbox,
        timeout: DEFAULT_TIMEOUT
    };

    constructor(key = "") {
        this.key = key;
        this.payments = new _payments(key || "", this.httpConfiguration);
        this.sources = new _sources(key || "", this.httpConfiguration);
        this.tokens = new _tokens("", this.httpConfiguration);
    }

    public setSecretKey = (key: string) => {
        this.key = key;
        this.payments.key = key;
        this.sources.key = key;
    };

    public setPublicKey = (key: string) => {
        this.tokens.key = key;
    };

    public setHttpConfiguration = (httpConfiguration: HttpConfigurationType) => {
        this.httpConfiguration = httpConfiguration;
        this.payments.httpConfiguration = httpConfiguration;
        this.sources.httpConfiguration = httpConfiguration;
        this.tokens.httpConfiguration = httpConfiguration;
    };
}
