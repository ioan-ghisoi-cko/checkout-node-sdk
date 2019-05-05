import _payments from './payments/payments';

export default class checkout {
    private key: string = '';
    private request_retries: number = 1;
    public payments: _payments;

    constructor(key: string) {
        this.key = key;
        this.payments = new _payments(key);
    }

    public setRequestRetries = (retry: number) => {
        this.request_retries = retry;
    }
}
