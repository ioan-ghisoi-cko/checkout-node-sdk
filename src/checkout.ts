import _payments from "./payments/payments";
import { Constants as constants } from "./common/constants";
import { Configuration } from "./configuration";

export default class Checkout {
    private key: string;
    public payments: _payments;
    public httpConfiguration: Configuration = {
        retries: constants.DEFAULT_RETRIES,
        timeout: constants.DEFAULT_TIMEOUT
    };

    constructor(key: string) {
        this.key = key;
        this.payments = new _payments(key, this.httpConfiguration);
    }

    public setHttpConfiguration = (config: Configuration) => {
        this.httpConfiguration = config;
        this.payments.setHttpConfiguration(config);
    };
}
