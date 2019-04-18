// const checkout = require('../lib/index');
import * as checkout from '../lib/index';
import { expect } from 'chai';

describe('Basic Suite', () => {
    it("should work", async () => {
        let cko = checkout.api('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
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
    });
});
