// const { checkout } = require('../lib/index');
import { checkout, PaymentRequest, CardSource, NetworkTokenSource } from '../lib/index';
import { expect } from 'chai';

let api = new checkout('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');

describe('Full card charges', () => {
    it("should produce successful authorisation response", async () => {
        let outcome = await api.payments.request<CardSource>({
            source: new CardSource({
                number: '4242424242424242',
                expiry_month: '06',
                expiry_year: '2029',
                cvv: '100'
            }),
            currency: "USD",
            amount: 100
        });

        expect(outcome.is_successful).to.be.true;
        expect(outcome.is_approved).to.be.true;
        expect(outcome.is_pending).to.be.false;
        expect(outcome.http_code).to.equal(201);
    });

    it("should produce a decline response", async () => {
        let outcome = await api.payments.request<CardSource>({
            source: new CardSource({
                number: '4242424242424242',
                expiry_month: '06',
                expiry_year: '2029',
                cvv: '100'
            }),
            currency: "USD",
            amount: 1005
        });
        expect(outcome.is_successful).to.be.false;
        expect(outcome.is_approved).to.be.false;
        expect(outcome.is_pending).to.be.false;
        expect(outcome.http_code).to.equal(201);
    });

    it("should produce a flagged response", async () => {
        let outcome = await api.payments.request<CardSource>({
            source: new CardSource({
                number: '4242424242424242',
                expiry_month: '06',
                expiry_year: '2029',
                cvv: '100'
            }),
            currency: "USD",
            amount: 100000
        });
        expect(outcome.is_successful).to.be.false;
        expect(outcome.is_approved).to.be.true;
        expect(outcome.is_pending).to.be.true;
        expect(outcome.http_code).to.equal(201);
    });

    it("should produce a 3DS response", async () => {
        let outcome = await api.payments.request<CardSource>({
            source: new CardSource({
                number: '4242424242424242',
                expiry_month: '06',
                expiry_year: '2029',
                cvv: '100'
            }),
            currency: "USD",
            amount: 100000
        });
        expect(outcome.is_successful).to.be.false;
        expect(outcome.is_approved).to.be.true;
        expect(outcome.is_pending).to.be.true;
        expect(outcome.http_code).to.equal(201);
    });
});
