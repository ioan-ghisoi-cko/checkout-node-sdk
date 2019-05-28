import _payments from "./payments/payments";
import { HttpConfiguration } from "./configuration";
import { Environment, HttpConfig } from "./index";

export default class Checkout {
    private key: string;
    public payments: _payments;
    public httpConfiguration: HttpConfiguration = new HttpConfiguration({
        environment: Environment.Sandbox,
        timeout: 5000
    });

    constructor(key: string) {
        this.key = key;
        this.payments = new _payments(key, this.httpConfiguration);
    }

    public setHttpConfiguration = (config: HttpConfig) => {
        const cnf = new HttpConfiguration(config);
        this.httpConfiguration = cnf;
        this.payments.setHttpConfiguration(cnf);
    };
}
