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


const test = async () => {
    let checkout = api("sk_test_43ed9a7f-4799-461d-b201-a70507878b51");
    let outcome = await checkout.payments.request({
        source: {
            type: "card",
            number: '4242424242424242',
            expiry_month: '06',
            expiry_year: '2028',
        },
        currency: "USD",
        amount: 100
    })
    console.log(outcome);
}

test();

export default api;
// module.exports = api;
