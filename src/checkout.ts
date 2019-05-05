import _payments from './payments/payments';
import { HttpOptions } from './models/types';
import { constants } from './common/constants';

export default class checkout {
    private key: string = '';
    public http_options: HttpOptions = {
        reties: constants.DEFAULT_RETRIES,
        timeout: constants.DEFAULT_TIMEOUT
    };
    public payments: _payments;

    constructor(key: string) {
        this.key = key;
        this.payments = new _payments(key, this.http_options);
    }

    public setHttpOptions = (options: HttpOptions) => {
        this.http_options = options;
        this.payments.setHttpOptions(options);
    }
}
