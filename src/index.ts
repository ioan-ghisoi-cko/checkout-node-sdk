import _payments from './payments';

class checkout {
    key: string = ''
    payments: _payments;

    public constructor(key: string) {
        this.key = key;
        this.payments = new _payments(key);
    }
}

export function api(key: string): checkout {
    return new checkout(key)
}

module.exports = { api };
