import _payments from './payments';

class checkout {
    key: string = ''
    payments: _payments;

    public constructor(key: string) {
        this.key = key;
        this.payments = new _payments(key);
    }
}

const api = (key: string): checkout => {
    return new checkout(key)
}

export default api;
module.exports = api;
