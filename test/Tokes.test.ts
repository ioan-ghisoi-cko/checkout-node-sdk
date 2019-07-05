import { expect } from 'chai'
import sources from '../src/api/Sources';
import { Environment } from '../src';
import {
	ValidationError,
	BadGateway,
} from '../src/models/response/HttpErrors';
const nock = require("nock");

describe("Sources", async () => {
	it("should create instance of sources class with a HTTP configuration", async () => {
		const source = new sources('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
		expect(source).to.be.instanceOf(sources);
		expect(source.key).to.equal('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
		expect(source.httpConfiguration.timeout).to.equal(5000);
	});

	it("should set http configuration and key in constructor", async () => {
		const source = new sources('sk_test_43ed9a7f-4799-461d-b201-a70507878b51', {
			timeout: 4000,
			environment: Environment.Sandbox
		});
		expect(source.key).to.equal('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
		expect(source.httpConfiguration.timeout).to.equal(4000);
	});

	it("should set http configuration and key with parameter", async () => {
		const source = new sources('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');

		source.httpConfiguration = {
			timeout: 4000,
			environment: Environment.Sandbox
		};

		source.key = 'sk_test_43ed9a7f-4799-461d-b201-a70507878b51';

		expect(source.key).to.equal('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
		expect(source.httpConfiguration.timeout).to.equal(4000);
	});

	it("should create a SEPA source", async () => {
		nock("https://api.sandbox.checkout.com")
			.post("/sources")
			.reply(201, {
				id: 'src_hxyuj3yhw75e5kflc5iohnx4gm',
				type: 'Sepa',
				response_code: '10000',
				customer: { id: 'cus_4xf2jna2thteniloyxururcq6y' },
				response_data: { mandate_reference: 'Z10001207433307' },
				_links:
				{
					'sepa:mandate-cancel':
					{
						href:
							'https://nginxtest.ckotech.co/sepa-external/mandates/src_hxyuj3yhw75e5kflc5iohnx4gm/cancel'
					},
					'sepa:mandate-get':
					{
						href:
							'https://nginxtest.ckotech.co/sepa-external/mandates/src_hxyuj3yhw75e5kflc5iohnx4gm'
					}
				}
			});

		const paymentSources = new sources('sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f808', {
			timeout: 4000,
			environment: Environment.Sandbox
		});

		let source = await paymentSources.add({
			type: 'sepa',
			billing_address: {
				address_line1: "test me",
				address_line2: "test me 2",
				city: "london",
				state: "london",
				zip: "w1w w1w",
				country: "DE"
			},
			source_data: {
				first_name: "Johnny",
				last_name: "Shrewd",
				account_iban: "DE25100100101234567893",
				bic: "PBNKDEFFXXX",
				billing_descriptor: "TST",
				mandate_type: "single"
			}
		})
		expect(source.response_code).to.equal('10000');
		expect(source.type).to.equal('Sepa');
	});

	it("should throw AuthenticationError", async () => {
		nock("https://api.sandbox.checkout.com")
			.post("/sources")
			.reply(401);

		try {
			const paymentSources = new sources('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');

			let source = await paymentSources.add({
				type: 'sepa',
				billing_address: {
					address_line1: "test me",
					address_line2: "test me 2",
					city: "london",
					state: "london",
					zip: "w1w w1w",
					country: "DE"
				},
				source_data: {
					first_name: "Johnny",
					last_name: "Shrewd",
					account_iban: "DE25100100101234567893",
					bic: "PBNKDEFFXXX",
					billing_descriptor: "TST",
					mandate_type: "single"
				}
			})
		} catch (err) {
			expect(err.name).to.equal('AuthenticationError');
		}
	});

	it("should throw ValidationError", async () => {
		nock("https://api.sandbox.checkout.com")
			.post("/sources")
			.reply(422, {
				"request_id": "0HL80RJLS76I7",
				"error_type": "request_invalid",
				"error_codes": [
					"payment_source_required"
				]
			});

		try {
			const paymentSources = new sources('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');

			let source = await paymentSources.add({
				type: 'sepa',
				billing_address: {
					address_line1: "test me",
					address_line2: "test me 2",
					city: "london",
					state: "london",
					zip: "w1w w1w",
					country: "DE"
				},
				source_data: {
					first_name: "Johnny",
					last_name: "Shrewd",
					account_iban: "DE25100100101234567893",
					bic: "PBNKDEFFXXX",
					billing_descriptor: "TST",
					mandate_type: "single"
				}
			})
		} catch (err) {
			expect(err).to.be.instanceOf(ValidationError)
		}
	});

	it("should throw ValidationError", async () => {
		nock("https://api.sandbox.checkout.com")
			.post("/sources")
			.reply(502);

		try {
			const paymentSources = new sources('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');

			let source = await paymentSources.add({
				type: 'sepa',
				billing_address: {
					address_line1: "test me",
					address_line2: "test me 2",
					city: "london",
					state: "london",
					zip: "w1w w1w",
					country: "DE"
				},
				source_data: {
					first_name: "Johnny",
					last_name: "Shrewd",
					account_iban: "DE25100100101234567893",
					bic: "PBNKDEFFXXX",
					billing_descriptor: "TST",
					mandate_type: "single"
				}
			})
		} catch (err) {
			expect(err).to.be.instanceOf(BadGateway)
		}
	});
});