// const { checkout } = require('../lib/index');
const nock = require("nock");
import {
	checkout,
	CardSource,
	HttpConfiguration
	// PaymentError,
	// PaymentResponse,
	// PaymentActionRequired,
	// TokenSource
} from "../src/index";
import { expect } from "chai";
import { ValidationError, AuthenticationError } from "../src/models/errors";
import Payments from "../src/payments/payments";
import { PaymentProcessed, PaymentActionRequired } from "../src/models/responses";

const SK = "sk_test_43ed9a7f-4799-461d-b201-a70507878b51"

let api = new checkout(SK);

describe("Full card charge", () => {
	it("should set secret key", async () => {
		api.setSecretKey("test");
		console.log
		expect(api.key).to.equal("test");
		expect(api.payments.key).to.equal("test");
		api.setSecretKey(SK);
	});

	it("should produce successful authorisation response", async () => {
		let transaction = await api.payments.request<CardSource>({
			source: new CardSource({
				number: "4242424242424242",
				expiry_month: "06",
				expiry_year: "2029",
				cvv: "100"
			}),
			currency: "USD",
			amount: 100
		});

		let outcome = transaction.body as PaymentProcessed;

		expect(transaction.http_code).to.equal(201);
		expect(outcome.approved).to.be.true;
		expect(outcome.risk.flagged).to.be.false;
		expect(outcome._links.redirect).to.be.undefined;
	});

	it("should produce a decline response", async () => {
		let transaction = await api.payments.request<CardSource>({
			source: new CardSource({
				number: "4242424242424242",
				expiry_month: "06",
				expiry_year: "2029",
				cvv: "100"
			}),
			currency: "USD",
			amount: 1005
		});

		let outcome = transaction.body as PaymentProcessed;

		expect(transaction.http_code).to.equal(201);
		expect(outcome.approved).to.be.false;
		expect(outcome.risk.flagged).to.be.false;
		expect(outcome._links.redirect).to.be.undefined;
	});

	it("should produce a flagged response", async () => {
		let transaction = await api.payments.request<CardSource>({
			source: new CardSource({
				number: "4242424242424242",
				expiry_month: "06",
				expiry_year: "2029",
				cvv: "100"
			}),
			currency: "USD",
			amount: 100000
		});

		let outcome = transaction.body as PaymentProcessed;

		expect(transaction.http_code).to.equal(201);
		expect(outcome.approved).to.be.true;
		expect(outcome.risk.flagged).to.be.true;
		expect(outcome._links.capture!.href).to.not.be.undefined;
	});

	it("should produce a 3DS response", async () => {
		let transaction = await api.payments.request<CardSource>({
			source: new CardSource({
				number: "4242424242424242",
				expiry_month: "06",
				expiry_year: "2029",
				cvv: "100"
			}),
			currency: "USD",
			amount: 1000,
			"3ds": {
				enabled: true
			}
		});

		let outcome = transaction.body as PaymentActionRequired;

		expect(transaction.http_code).to.equal(202);
		expect(outcome["3ds"]!.enrolled).to.equal("Y");
		expect(outcome.status).to.equal("Pending");
		expect(outcome._links.redirect!.href).to.not.be.undefined;
	});

	it("should produce an error response", async () => {
		api.setHttpConfiguration(new HttpConfiguration({
			timeout: 5000
		}));
		try {
			// @ts-ignore
			let transaction = await api.payments.request<CardSource>({
				currency: "USD",
				amount: 1000,
				"3ds": {
					enabled: true
				}
			});
		} catch (error) {
			let err = error as ValidationError;
			expect(err.http_code).to.equal(422);
			expect(err.body.error_type).to.equal("request_invalid");
		}
	});

	it("should throw with error body", async () => {
		nock("https://api.sandbox.checkout.com")
			.post("/payments")
			.delay(3000)
			.reply(500, {
				transaction: {
					body: {
						http_code: 500
					}
				}
			});

		try {
			let transaction = await api.payments.request<CardSource>({
				source: new CardSource({
					number: "4242424242424242",
					expiry_month: "06",
					expiry_year: "2029",
					cvv: "100"
				}),
				currency: "USD",
				amount: 100
			});
		} catch (err) {
			expect(err.transaction.body.http_code).to.equal(500);
		}
	});

	it("should timeout", async () => {
		nock("https://api.sandbox.checkout.com")
			.post("/payments")
			.delay(6000)
			.reply(500, {
				transaction: {
					body: {
						http_code: 500
					}
				}
			});

		try {
			let transaction = await api.payments.request<CardSource>({
				source: new CardSource({
					number: "4242424242424242",
					expiry_month: "06",
					expiry_year: "2029",
					cvv: "100"
				}),
				currency: "USD",
				amount: 100
			});
		} catch (err) {
			expect(err.type).to.equal('request-timeout');
		}
	});

	it("should produce 401 error", async () => {
		nock("https://api.sandbox.checkout.com")
			.post("/payments")
			.reply(401);

		const tmpApi = new checkout();
		try {
			let transaction = await tmpApi.payments.request<CardSource>({
				source: new CardSource({
					number: "4242424242424242",
					expiry_month: "06",
					expiry_year: "2029",
					cvv: "100"
				}),
				currency: "USD",
				amount: 100
			});
		} catch (err) {
			expect(err).to.be.an.instanceof(AuthenticationError);
		}
	});
});
