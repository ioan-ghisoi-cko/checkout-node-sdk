import _payments from "./payments/payments";
import { HttpOptions } from "./models/types";
import { Constants as constants } from "./common/constants";

export default class Checkout {
    private key: string;
    public payments: _payments;
    public httpOptions: HttpOptions = {
        reties: constants.DEFAULT_RETRIES,
        timeout: constants.DEFAULT_TIMEOUT
    };

    constructor(key: string) {
        this.key = key;
        this.payments = new _payments(key, this.httpOptions);
    }

    public setHttpOptions = (options: HttpOptions) => {
        this.httpOptions = options;
        this.payments.setHttpOptions(options);
    };
}
