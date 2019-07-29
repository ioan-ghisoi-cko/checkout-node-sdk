import { expect } from 'chai'
import tokens from '../src/api/Tokens';
import { Environment, CardSource, ApplePaySource, GooglePaySource } from '../src';
import {
	AuthenticationError,
	ValidationError,
} from '../src/models/response/HttpErrors';
const nock = require("nock");

describe("Tokens", async () => {
	it("should create instance of Tokens class with a HTTP configuration", async () => {
		const source = new tokens('pk_test_6e40a700-d563-43cd-89d0-f9bb17d35e73');
		expect(source).to.be.instanceOf(tokens);
		expect(source.key).to.equal('pk_test_6e40a700-d563-43cd-89d0-f9bb17d35e73');
		expect(source.httpConfiguration.timeout).to.equal(5000);
	});

	it("should set http configuration and key in constructor", async () => {
		const source = new tokens('pk_test_6e40a700-d563-43cd-89d0-f9bb17d35e73', {
			timeout: 4000,
			environment: Environment.Sandbox
		});
		expect(source.key).to.equal('pk_test_6e40a700-d563-43cd-89d0-f9bb17d35e73');
		expect(source.httpConfiguration.timeout).to.equal(4000);
	});

	it("should set http configuration and key with parameter", async () => {
		const source = new tokens('pk_test_6e40a700-d563-43cd-89d0-f9bb17d35e73');

		source.httpConfiguration = {
			timeout: 4000,
			environment: Environment.Sandbox
		};

		source.key = 'pk_test_6e40a700-d563-43cd-89d0-f9bb17d35e73';

		expect(source.key).to.equal('pk_test_6e40a700-d563-43cd-89d0-f9bb17d35e73');
		expect(source.httpConfiguration.timeout).to.equal(4000);
	});

	it("should create a Card Token", async () => {
		nock("https://api.sandbox.checkout.com")
			.post("/tokens")
			.reply(201, {
				"type": "card",
				"token": "tok_ubfj2q76miwundwlk72vxt2i7q",
				"expires_on": "2019-07-05T20:41:02Z",
				"expiry_month": 6,
				"expiry_year": 2025,
				"scheme": "VISA",
				"last4": "9996",
				"bin": "454347",
				"card_type": "Credit",
				"card_category": "Consumer",
				"issuer": "GOTHAM STATE BANK",
				"issuer_country": "US",
				"product_id": "F",
				"product_type": "CLASSIC",
				"billing_address": {
					"address_line1": "Checkout.com",
					"address_line2": "90 Tottenham Court Road",
					"city": "London",
					"state": "London",
					"zip": "W1T 4TJ",
					"country": "GB"
				},
				"phone": {
					"country_code": "+1",
					"number": "415 555 2671"
				},
				"name": "Bruce Wayne"
			});

		const tok = new tokens('pk_test_6e40a700-d563-43cd-89d0-f9bb17d35e73', {
			timeout: 4000,
			environment: Environment.Sandbox
		});

		let token = await tok.request(new CardSource({
			number: "4543474002249996",
			expiry_month: 6,
			expiry_year: 2029,
			cvv: "956"
		}));

		expect(token.last4).to.equal('9996');
		expect(token.type).to.equal('card');
	});

	it("should create a Apple Token", async () => {
		nock("https://api.sandbox.checkout.com")
			.post("/tokens")
			.reply(201, {
				"type": "applepay",
				"token": "tok_ubfj2q76miwundwlk72vxt2i7q",
				"expires_on": "2019-07-05T20:41:02Z",
				"expiry_month": 6,
				"expiry_year": 2025,
				"scheme": "VISA",
				"last4": "9996",
				"bin": "454347",
				"card_type": "Credit",
				"card_category": "Consumer",
				"issuer": "GOTHAM STATE BANK",
				"issuer_country": "US",
				"product_id": "F",
				"product_type": "CLASSIC"
			});

		const tok = new tokens('pk_test_6e40a700-d563-43cd-89d0-f9bb17d35e73', {
			timeout: 4000,
			environment: Environment.Sandbox
		});

		let token = await tok.request(new ApplePaySource({
			token_data: {
				version: "test",
				data: "test",
				signature: "test",
				header: "test"
			}
		}));

		expect(token.last4).to.equal('9996');
		expect(token.type).to.equal('applepay');
	});

	it("should create a Google Token", async () => {
		nock("https://api.sandbox.checkout.com")
			.post("/tokens")
			.reply(201, {
				"type": "googlepay",
				"token": "tok_ubfj2q76miwundwlk72vxt2i7q",
				"expires_on": "2019-07-05T20:41:02Z",
				"expiry_month": 6,
				"expiry_year": 2025,
				"scheme": "VISA",
				"last4": "9996",
				"bin": "454347",
				"card_type": "Credit",
				"card_category": "Consumer",
				"issuer": "GOTHAM STATE BANK",
				"issuer_country": "US",
				"product_id": "F",
				"product_type": "CLASSIC"
			});

		const tok = new tokens('pk_test_6e40a700-d563-43cd-89d0-f9bb17d35e73', {
			timeout: 4000,
			environment: Environment.Sandbox
		});

		let token = await tok.request(new GooglePaySource({
			token_data: {
				signature: "test",
				protocolVersion: "test",
				signedMessage: "test"
			}
		}));

		expect(token.last4).to.equal('9996');
		expect(token.type).to.equal('googlepay');
	});

	it("should throw authentication error", async () => {
		nock("https://api.sandbox.checkout.com")
			.post("/tokens")
			.reply(401, {});

		try {
			const tok = new tokens('pk_test_6e40a700-d563-43cd-89d0-f9bb17d35e73', {
				timeout: 4000,
				environment: Environment.Sandbox
			});

			let token = await tok.request(new CardSource({
				number: "4543474002249996",
				expiry_month: 6,
				expiry_year: 2029,
				cvv: "956"
			}));
		} catch (err) {
			const error = err as AuthenticationError;
			expect(err).to.be.instanceOf(AuthenticationError)
		}
	});

	it("should throw ValidationError error", async () => {
		nock("https://api.sandbox.checkout.com")
			.post("/tokens")
			.reply(422, {
				"request_id": "0HL80RJLS76I7",
				"error_type": "request_invalid",
				"error_codes": [
					"payment_source_required"
				]
			});

		try {
			const tok = new tokens('pk_test_6e40a700-d563-43cd-89d0-f9bb17d35e73', {
				timeout: 4000,
				environment: Environment.Sandbox
			});

			let token = await tok.request(new CardSource({
				number: "4543474002249996",
				expiry_month: 6,
				expiry_year: 2029,
				cvv: "956"
			}));
		} catch (err) {
			expect(err).to.be.instanceOf(ValidationError)
		}
	});
});