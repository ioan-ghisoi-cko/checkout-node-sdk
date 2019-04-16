const cko = require('../index')('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');

import { expect } from 'chai';

describe('Basic Suite', async () => {
    it('Dumb test', async () => {
        expect(true).to.equal(true);
        let outcome = await cko.payments.request({
            source: {
                type: "card",
                number: '4242424242424242',
                expiry_month: '06',
                expiry_year: '2028',
            },
            currency: "USD",
            amount: 100
        });
        expect(outcome.http_code).to.equal(201);
    })
});
