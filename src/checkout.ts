import _payments from './payments/payments';

export default class checkout {
    private key: string = ''
    public payments: _payments;

    constructor(key: string) {
        this.key = key;
        this.payments = new _payments(key);
    }
}
