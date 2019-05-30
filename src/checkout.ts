import _payments from "./payments/payments";
import { HttpConfiguration } from "./configuration";
import { Environment, HttpConfig } from "./index";

export default class Checkout {
    public payments: _payments;
    public httpConfiguration: HttpConfiguration = new HttpConfiguration({
        environment: Environment.Sandbox,
        timeout: 5000
    });

    constructor(public key?: string) {
        this.payments = new _payments(key || '', this.httpConfiguration);
    }

    public setSecretKey = (key: string) => {
        this.key = key;
        this.payments.setSecretKey(key);
    };

    public setHttpConfiguration = (config: HttpConfig) => {
        const cnf = new HttpConfiguration(config);
        this.httpConfiguration = cnf;
        this.payments.setHttpConfiguration(cnf);
    };
}
