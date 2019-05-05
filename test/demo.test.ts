// const { checkout } = require('../lib/index');
import { checkout, CardSource, PaymentError, PaymentResponse, PaymentActionRequired } from '../lib/index';
import { expect } from 'chai';

let api = new checkout('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');

describe('Full card charge', () => {
    it("should produce successful authorisation response", async () => {
        let transaction = await api.payments.request<CardSource>({
            source: new CardSource({
                number: '4242424242424242',
                expiry_month: '06',
                expiry_year: '2029',
                cvv: '100'
            }),
            currency: "USD",
            amount: 100
        });

        let response = transaction.body as PaymentResponse;

        expect(transaction.http_code).to.equal(201);
        expect(response.approved).to.be.true;
        expect(response.risk.flagged).to.be.false;
        expect(response._links.redirect).to.be.undefined;
    });

    it("should produce a decline response", async () => {
        let transaction = await api.payments.request<CardSource>({
            source: new CardSource({
                number: '4242424242424242',
                expiry_month: '06',
                expiry_year: '2029',
                cvv: '100'
            }),
            currency: "USD",
            amount: 1005
        });

        let response = transaction.body as PaymentResponse;

        expect(transaction.http_code).to.equal(201);
        expect(response.approved).to.be.false;
        expect(response.risk.flagged).to.be.false;
        expect(response._links.redirect).to.be.undefined;
    });

    it("should produce a flagged response", async () => {
        let transaction = await api.payments.request<CardSource>({
            source: new CardSource({
                number: '4242424242424242',
                expiry_month: '06',
                expiry_year: '2029',
                cvv: '100'
            }),
            currency: "USD",
            amount: 100000
        });

        let response = transaction.body as PaymentResponse;

        expect(transaction.http_code).to.equal(201);
        expect(response.approved).to.be.true;
        expect(response.risk.flagged).to.be.true;
        expect(response._links.capture!.href).to.not.be.undefined;
    });

    it("should produce a 3DS response", async () => {
        let transaction = await api.payments.request<CardSource>({
            source: new CardSource({
                number: '4242424242424242',
                expiry_month: '06',
                expiry_year: '2029',
                cvv: '100'
            }),
            currency: "USD",
            amount: 1000,
            '3ds': {
                enabled: true
            }
        });

        let response = transaction.body as PaymentActionRequired;

        expect(transaction.http_code).to.equal(202);
        expect(response["3ds"]!.enrolled).to.equal('Y');
        expect(response.status).to.equal('Pending');
        expect(response._links.redirect!.href).to.not.be.undefined;
    });

    it("should produce an error response", async () => {
        api.setHttpOptions({
            reties: 2,
            timeout: 5000,
        })
        try {
            // @ts-ignore
            let transaction = await api.payments.request<CardSource>({
                currency: "USD",
                amount: 1000,
                '3ds': {
                    enabled: true
                }
            });
        } catch (error) {
            let err = error as PaymentError;
            expect(err.http_code).to.equal(422);
            expect(err.body.error_type).to.equal('request_invalid');
        }
    });
});
