import { expect } from 'chai'
import { Environment, CardSource, ApplePaySource, GooglePaySource, NoWebhooksConfigured } from '../src';
import {
	AuthenticationError,
	ValidationError,
	NotFoundError,
	UnprocessableError,
	TooManyRequestsError
} from '../src/models/response/HttpErrors';
import reconciliation from '../src/api/Reconciliation';
const nock = require("nock");

describe("Reconciliation", async () => {
	it("should create instance of Reconciliation class with a HTTP configuration", async () => {
		const rec = new reconciliation('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
		expect(rec).to.be.instanceOf(reconciliation);
		expect(rec.key).to.equal('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
		expect(rec.httpConfiguration.timeout).to.equal(5000);
	});

	it("should set http configuration and key in constructor", async () => {
		const rec = new reconciliation('sk_test_43ed9a7f-4799-461d-b201-a70507878b51', {
			timeout: 4000,
			environment: Environment.Sandbox
		});
		expect(rec.key).to.equal('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
		expect(rec.httpConfiguration.timeout).to.equal(4000);
	});

	it("should set http configuration and key with parameter", async () => {
		const rec = new reconciliation('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');

		rec.httpConfiguration = {
			timeout: 4000,
			environment: Environment.Sandbox
		};

		rec.key = 'sk_test_43ed9a7f-4799-461d-b201-a70507878b51';
		expect(rec.key).to.equal('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
		expect(rec.httpConfiguration.timeout).to.equal(4000);
	});

	it("should pull payment details", async () => {
		nock("https://api.checkout.com")
			.get("/reporting/payments/pay_nezg6bx2k22utmk4xm5s2ughxi")
			.reply(200, {
				"count": 1,
				"data": [
					{
						"id": "pay_nezg6bx2k22utmk4xm5s2ughxi",
						"processing_currency": "USD",
						"payout_currency": "GBP",
						"requested_on": "2019-03-08T10:29:51.922",
						"channel_name": "www.example.com",
						"reference": "ORD-5023-4E89",
						"payment_method": "VISA",
						"card_type": "CREDIT",
						"card_category": "Consumer",
						"issuer_country": "US",
						"merchant_country": "SI",
						"mid": "123456",
						"actions": [
							{
								"type": "Authorization",
								"id": "act_nezg6bx2k22utmk4xm5s2ughxi",
								"processed_on": "2019-03-08T10:29:51.922",
								"response_code": "10000",
								"response_description": "Approved",
								"breakdown": [
									{
										"type": "Gateway Fee Tax ARE USD/GBP@0.7640412612",
										"date": "2019-03-08T10:29:51.922",
										"processing_currency_amount": -0.003,
										"payout_currency_amount": -0.00229212
									},
									{
										"type": "Authorization Fee Tax ARE USD/GBP@0.7640412612",
										"date": "2019-03-08T10:29:51.922",
										"processing_currency_amount": -0.0045,
										"payout_currency_amount": -0.00343819
									},
									{
										"type": "Scheme Fixed Fee Tax ARE USD/GBP@0.7640412612",
										"date": "2019-03-08T10:29:51.922",
										"processing_currency_amount": -0.00238223,
										"payout_currency_amount": -0.00182012
									},
									{
										"type": "Gateway Fee USD/GBP@0.7640412612",
										"date": "2019-03-08T10:29:51.922",
										"processing_currency_amount": -0.06,
										"payout_currency_amount": -0.04584248
									},
									{
										"type": "Authorization Fee USD/GBP@0.7640412612",
										"date": "2019-03-08T10:29:51.922",
										"processing_currency_amount": -0.09,
										"payout_currency_amount": -0.06876371
									},
									{
										"type": "Scheme Fixed Fee USD/GBP@0.7640412612",
										"date": "2019-03-08T10:29:51.922",
										"processing_currency_amount": -0.04764462,
										"payout_currency_amount": -0.03640246
									}
								]
							},
							{
								"type": "Capture",
								"id": "act_chgfpd2kn3iellv7hwo6cfekea",
								"processed_on": "2019-03-08T10:29:52.562",
								"response_code": "10000",
								"response_description": "Approved",
								"breakdown": [
									{
										"type": "Gateway Fee Tax ARE USD/GBP@0.7640412612",
										"date": "2019-03-08T10:29:52.562",
										"processing_currency_amount": -0.003,
										"payout_currency_amount": -0.00229212
									},
									{
										"type": "Capture Fee Tax ARE USD/GBP@0.7640412612",
										"date": "2019-03-08T10:29:52.562",
										"processing_currency_amount": -0.0045,
										"payout_currency_amount": -0.00343819
									},
									{
										"type": "Scheme Fixed Fee Tax ARE USD/GBP@0.7640412612",
										"date": "2019-03-08T10:29:52.562",
										"processing_currency_amount": -0.00364341,
										"payout_currency_amount": -0.00278372
									},
									{
										"type": "Scheme Variable Fee Tax ARE USD/GBP@0.7640412612",
										"date": "2019-03-08T10:29:52.562",
										"processing_currency_amount": -0.00714,
										"payout_currency_amount": -0.00545525
									},
									{
										"type": "Premium Fee Tax ARE USD/GBP@0.7640412612",
										"date": "2019-03-08T10:29:52.562",
										"processing_currency_amount": -0.06,
										"payout_currency_amount": -0.04584248
									},
									{
										"type": "Gateway Fee USD/GBP@0.7640412612",
										"date": "2019-03-08T10:29:52.562",
										"processing_currency_amount": -0.06,
										"payout_currency_amount": -0.04584248
									},
									{
										"type": "Capture Fee USD/GBP@0.7640412612",
										"date": "2019-03-08T10:29:52.562",
										"processing_currency_amount": -0.09,
										"payout_currency_amount": -0.06876371
									},
									{
										"type": "Scheme Fixed Fee USD/GBP@0.7640412612",
										"date": "2019-03-08T10:29:52.562",
										"processing_currency_amount": -0.07286825,
										"payout_currency_amount": -0.05567435
									},
									{
										"type": "Scheme Variable Fee USD/GBP@0.7640412612",
										"date": "2019-03-08T10:29:52.562",
										"processing_currency_amount": -0.1428,
										"payout_currency_amount": -0.10910509
									},
									{
										"type": "Premium Fee USD/GBP@0.7640412612",
										"date": "2019-03-08T10:29:52.562",
										"processing_currency_amount": -1.2,
										"payout_currency_amount": -0.91684951
									},
									{
										"type": "RR (0.06%, Release: 2019-03-08) USD/GBP@0.7640412612",
										"date": "2019-03-08T10:29:52.562",
										"processing_currency_amount": -0.012,
										"payout_currency_amount": -0.01
									},
									{
										"type": "Captured USD/GBP@0.7640412612",
										"date": "2019-03-08T10:29:52.562",
										"processing_currency_amount": 20,
										"payout_currency_amount": 15.28082522
									}
								]
							}
						],
						"_links": {
							"self": {
								"href": "https://api.checkout.com/reporting/payments/pay_nezg6bx2k22utmk4xm5s2ughxi"
							}
						}
					}
				],
				"_links": {
					"self": {
						"href": "https://api.checkout.com/reporting/payments/pay_nezg6bx2k22utmk4xm5s2ughxi"
					}
				}
			});
		const rec = new reconciliation('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
		const outcome = await rec.getPayment('pay_nezg6bx2k22utmk4xm5s2ughxi');
		expect(outcome.data[0].id).to.equal('pay_nezg6bx2k22utmk4xm5s2ughxi');
	});


	it("should throw unauthorised error", async () => {
		nock("https://api.checkout.com")
			.get("/reporting/payments/pay_nezg6bx2k22utmk4xm5s2ughxi")
			.reply(401);
		const rec = new reconciliation('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');

		try {
			const outcome = await rec.getPayment("pay_nezg6bx2k22utmk4xm5s2ughxi");
			throw ({ err: 'err' })
		} catch (err) {
			const error = err as AuthenticationError;
			expect(err).to.be.instanceOf(AuthenticationError)
		}
	});

});