import { expect } from 'chai'
import { Environment, CardSource, ApplePaySource, GooglePaySource, NoWebhooksConfigured } from '../src';
import {
	AuthenticationError,
	ValidationError,
	NotFoundError,
	UrlAlreadyRegistered
} from '../src/models/response/HttpErrors';
import events from '../src/api/Events';
const nock = require("nock");

describe("Retrieve event types", async () => {
	it("should create instance of Event class with a HTTP configuration", async () => {
		const evt = new events('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
		expect(evt).to.be.instanceOf(events);
		expect(evt.key).to.equal('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
		expect(evt.httpConfiguration.timeout).to.equal(5000);
	});

	it("should set http configuration and key in constructor", async () => {
		const evt = new events('sk_test_43ed9a7f-4799-461d-b201-a70507878b51', {
			timeout: 4000,
			environment: Environment.Sandbox
		});
		expect(evt.key).to.equal('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
		expect(evt.httpConfiguration.timeout).to.equal(4000);
	});

	it("should set http configuration and key with parameter", async () => {
		const evt = new events('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');

		evt.httpConfiguration = {
			timeout: 4000,
			environment: Environment.Sandbox
		};

		evt.key = 'sk_test_43ed9a7f-4799-461d-b201-a70507878b51';
		expect(evt.key).to.equal('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
		expect(evt.httpConfiguration.timeout).to.equal(4000);
	});

	it("should retrieve event types", async () => {
		nock("https://api.sandbox.checkout.com")
			.get("/event-types?version=1.0")
			.reply(200, [
				{
					"version": "1.0",
					"event_types": [
						"card.updated",
						"charge.captured",
						"charge.captured.deferred",
						"charge.captured.failed",
						"charge.chargeback",
						"charge.failed",
						"charge.pending",
						"charge.refunded",
						"charge.refunded.failed",
						"charge.retrieval",
						"charge.succeeded",
						"charge.voided",
						"charge.voided.failed",
						"invoice.cancelled"
					]
				}
			]);

		const evt = new events('sk_test_43ed9a7f-4799-461d-b201-a70507878b51', {
			timeout: 4000,
			environment: Environment.Sandbox
		});

		const types = await evt.retrieveEventTypes("1.0");
		expect(types.instances[0].version).to.equal('1.0');
	});

	it("should throw authentication error", async () => {
		nock("https://api.sandbox.checkout.com")
			.get("/event-types?version=1.0")
			.reply(401);

		const evt = new events('sk_test_43ed9a7f-4799-461d-b201-a70507878b51', {
			timeout: 4000,
			environment: Environment.Sandbox
		});

		try {
			const types = await evt.retrieveEventTypes("1.0");
		} catch (err) {
			const error = err as AuthenticationError;
			expect(err).to.be.instanceOf(AuthenticationError)
		}
	});
});

describe("Retrieve events", async () => {
	it("should retrieve events", async () => {
		nock("https://api.sandbox.checkout.com")
			.get("/events")
			.reply(200, {
				"total_count": 100,
				"limit": 10,
				"skip": 10,
				"from": "2018-01-01T00:00:00Z",
				"to": "2018-01-15T12:00:00Z",
				"data": [
					{
						"id": "evt_az5sblvku4ge3dwpztvyizgcau",
						"type": "payment_approved",
						"created_on": "2019-07-14T21:21:41Z",
						"_links": {}
					}
				]
			});

		const evt = new events('sk_test_43ed9a7f-4799-461d-b201-a70507878b51', {
			timeout: 4000,
			environment: Environment.Sandbox
		});

		const outcome = await evt.retrieveEvents();
		expect(outcome.total_count).to.equal(100);
		expect(outcome.limit).to.equal(10);
	});

	it("should retrieve events with params", async () => {
		nock("https://api.sandbox.checkout.com")
			.get("/events?limit=2")
			.reply(200, {
				"total_count": 100,
				"limit": 2,
				"skip": 10,
				"from": "2018-01-01T00:00:00Z",
				"to": "2018-01-15T12:00:00Z",
				"data": [
					{
						"id": "evt_az5sblvku4ge3dwpztvyizgcau",
						"type": "payment_approved",
						"created_on": "2019-07-14T21:21:41Z",
						"_links": {}
					}
				]
			});

		const evt = new events('sk_test_43ed9a7f-4799-461d-b201-a70507878b51', {
			timeout: 4000,
			environment: Environment.Sandbox
		});

		const outcome = await evt.retrieveEvents({
			limit: '2',
		});
		expect(outcome.limit).to.equal(2);
	});

	it("should throw authentication error", async () => {
		nock("https://api.sandbox.checkout.com")
			.get("/events")
			.reply(401);

		const evt = new events('sk_test_43ed9a7f-4799-461d-b201-a70507878b51', {
			timeout: 4000,
			environment: Environment.Sandbox
		});

		try {
			const outcome = await evt.retrieveEvents();
		} catch (err) {
			const error = err as AuthenticationError;
			expect(err).to.be.instanceOf(AuthenticationError)
		}
	});

	it("should throw validation error", async () => {
		nock("https://api.sandbox.checkout.com")
			.get("/events")
			.reply(422, {
				"request_id": "0HL80RJLS76I7",
				"error_type": "request_invalid",
				"error_codes": [
					"payment_source_required"
				]
			});

		const evt = new events('sk_test_43ed9a7f-4799-461d-b201-a70507878b51', {
			timeout: 4000,
			environment: Environment.Sandbox
		});

		try {
			const outcome = await evt.retrieveEvents();
		} catch (err) {
			expect(err).to.be.instanceOf(ValidationError)
		}
	});
});

describe("Retrieve event", async () => {
	it("should retrieve events", async () => {
		nock("https://api.sandbox.checkout.com")
			.get("/events/evt_hxkvhyiokc6u7bd6mlo5u4dg3e")
			.reply(200, {
				"id": "evt_hxkvhyiokc6u7bd6mlo5u4dg3e",
				"type": "charge.captured",
				"version": "1.0",
				"created_on": "2019-07-12T00:09:22Z",
				"data": {
					"original_id": "charge_test_CD1AE8ED246T623939E4",
					"has_chargeback": "N",
					"id": "charge_test_8F4AE8ED246I623936D2",
					"live_mode": false,
					"charge_mode": 1,
					"response_code": "10000",
					"created": "2019-07-12T00:09:22Z",
					"value": 1200,
					"currency": "EUR",
					"track_id": "exp1",
					"description": "Recurring #12 for recurring customer plan id: cp_AF2E29BF046G76B90791",
					"response_message": "Approved",
					"response_advanced_info": "Approved",
					"status": "Captured",
					"products": []
				},
				"notifications": [
					{
						"url": "http://requestbin.fullcontact.com/1nk9ip41",
						"id": "ntf_ua4w3iqizxde3mnw6yzbm4qgqm",
						"notification_type": "Webhook",
						"success": false,
						"_links": {
							"self": {
								"href": "https://api.sandbox.checkout.com/events/evt_hxkvhyiokc6u7bd6mlo5u4dg3e/notifications/ntf_ua4w3iqizxde3mnw6yzbm4qgqm"
							}
						}
					},
					{
						"url": "http://requestbin.fullcontact.com/1nk9ip41",
						"id": "ntf_i2siy6h22tpetp33pldltm25ti",
						"notification_type": "Webhook",
						"success": false,
						"_links": {
							"self": {
								"href": "https://api.sandbox.checkout.com/events/evt_hxkvhyiokc6u7bd6mlo5u4dg3e/notifications/ntf_i2siy6h22tpetp33pldltm25ti"
							}
						}
					}
				],
				"_links": {
					"self": {
						"href": "https://api.sandbox.checkout.com/events/evt_hxkvhyiokc6u7bd6mlo5u4dg3e"
					},
					"webhooks-retry": {
						"href": "https://api.sandbox.checkout.com/events/evt_hxkvhyiokc6u7bd6mlo5u4dg3e/webhooks/retry"
					}
				}
			});

		const evt = new events('sk_test_43ed9a7f-4799-461d-b201-a70507878b51', {
			timeout: 4000,
			environment: Environment.Sandbox
		});

		const outcome = await evt.retrieveEvent("evt_hxkvhyiokc6u7bd6mlo5u4dg3e");
		expect(outcome.id).to.equal("evt_hxkvhyiokc6u7bd6mlo5u4dg3e");
	});

	it("should throw authentication error", async () => {
		nock("https://api.sandbox.checkout.com")
			.get("/events/evt_hxkvhyiokc6u7bd6mlo5u4dg3e")
			.reply(401);

		const evt = new events('sk_test_43ed9a7f-4799-461d-b201-a70507878b51', {
			timeout: 4000,
			environment: Environment.Sandbox
		});

		try {
			const outcome = await evt.retrieveEvent("evt_hxkvhyiokc6u7bd6mlo5u4dg3e");
		} catch (err) {
			const error = err as AuthenticationError;
			expect(err).to.be.instanceOf(AuthenticationError)
		}
	});

	it("should throw not found error", async () => {
		nock("https://api.sandbox.checkout.com")
			.get("/events/evt_hxkvhyiokc6u7bd6mlo5u4dg3e")
			.reply(404);

		const evt = new events('sk_test_43ed9a7f-4799-461d-b201-a70507878b51', {
			timeout: 4000,
			environment: Environment.Sandbox
		});

		try {
			const outcome = await evt.retrieveEvent("evt_hxkvhyiokc6u7bd6mlo5u4dg3e");
		} catch (err) {
			const error = err as NotFoundError;
			expect(err).to.be.instanceOf(NotFoundError)
		}
	});
});

describe("Retrieve event notification", async () => {
	it("should retrieve event notification ", async () => {
		nock("https://api.sandbox.checkout.com")
			.get("/events/evt_hxkvhyiokc6u7bd6mlo5u4dg3e/notifications/ntf_ua4w3iqizxde3mnw6yzbm4qgqm")
			.reply(200, {
				"url": "http://requestbin.fullcontact.com/1nk9ip41",
				"content_type": "json",
				"attempts": [
					{
						"status_code": 404,
						"response_body": "Not found",
						"send_mode": "automatic",
						"timestamp": "2019-07-12T06:10:21Z"
					},
					{
						"status_code": 404,
						"response_body": "Not found",
						"send_mode": "automatic",
						"timestamp": "2019-07-12T02:10:22Z"
					},
					{
						"status_code": 404,
						"response_body": "Not found",
						"send_mode": "automatic",
						"timestamp": "2019-07-12T01:10:21Z"
					},
					{
						"status_code": 404,
						"response_body": "Not found",
						"send_mode": "automatic",
						"timestamp": "2019-07-12T00:40:22Z"
					},
					{
						"status_code": 404,
						"response_body": "Not found",
						"send_mode": "automatic",
						"timestamp": "2019-07-12T00:25:21Z"
					},
					{
						"status_code": 404,
						"response_body": "Not found",
						"send_mode": "automatic",
						"timestamp": "2019-07-12T00:15:22Z"
					},
					{
						"status_code": 404,
						"response_body": "Not found",
						"send_mode": "automatic",
						"timestamp": "2019-07-12T00:09:23Z"
					}
				],
				"id": "ntf_ua4w3iqizxde3mnw6yzbm4qgqm",
				"success": false,
				"_links": {
					"self": {
						"href": "https://api.sandbox.checkout.com/events/evt_hxkvhyiokc6u7bd6mlo5u4dg3e/notifications/ntf_ua4w3iqizxde3mnw6yzbm4qgqm"
					},
					"webhook-retry": {
						"href": "https://api.sandbox.checkout.com/events/evt_hxkvhyiokc6u7bd6mlo5u4dg3e/webhooks/wh_f3vhjg7lhwgeleccuuwl55gmva/retry"
					}
				}
			});

		const evt = new events('sk_test_43ed9a7f-4799-461d-b201-a70507878b51', {
			timeout: 4000,
			environment: Environment.Sandbox
		});

		const outcome = await evt.retrieveEventNotification("evt_hxkvhyiokc6u7bd6mlo5u4dg3e", "ntf_ua4w3iqizxde3mnw6yzbm4qgqm");

		expect(outcome.id).to.equal("ntf_ua4w3iqizxde3mnw6yzbm4qgqm");
		expect(outcome.content_type).to.equal("json");
	});

	it("should throw authentication error", async () => {
		nock("https://api.sandbox.checkout.com")
			.get("/events/evt_hxkvhyiokc6u7bd6mlo5u4dg3e/notifications/ntf_ua4w3iqizxde3mnw6yzbm4qgqm")
			.reply(401);

		const evt = new events('sk_test_43ed9a7f-4799-461d-b201-a70507878b51', {
			timeout: 4000,
			environment: Environment.Sandbox
		});

		try {
			const outcome = await evt.retrieveEventNotification("evt_hxkvhyiokc6u7bd6mlo5u4dg3e", "ntf_ua4w3iqizxde3mnw6yzbm4qgqm");
		} catch (err) {
			const error = err as AuthenticationError;
			expect(err).to.be.instanceOf(AuthenticationError)
		}
	});

	it("should throw not found error", async () => {
		nock("https://api.sandbox.checkout.com")
			.get("/events/evt_hxkvhyiokc6u7bd6mlo5u4dg3e/notifications/ntf_ua4w3iqizxde3mnw6yzbm4qgqm")
			.reply(404);

		const evt = new events('sk_test_43ed9a7f-4799-461d-b201-a70507878b51', {
			timeout: 4000,
			environment: Environment.Sandbox
		});

		try {
			const outcome = await evt.retrieveEventNotification("evt_hxkvhyiokc6u7bd6mlo5u4dg3e", "ntf_ua4w3iqizxde3mnw6yzbm4qgqm");
		} catch (err) {
			const error = err as NotFoundError;
			expect(err).to.be.instanceOf(NotFoundError)
		}
	});
});

describe("Retry webhook", async () => {
	it("should retry event notification ", async () => {
		nock("https://api.sandbox.checkout.com")
			.post("/events/evt_hxkvhyiokc6u7bd6mlo5u4dg3e/webhooks/wh_f3vhjg7lhwgeleccuuwl55gmva/retry")
			.reply(202);

		const evt = new events('sk_test_43ed9a7f-4799-461d-b201-a70507878b51', {
			timeout: 4000,
			environment: Environment.Sandbox
		});
		const outcome = await evt.retry("evt_hxkvhyiokc6u7bd6mlo5u4dg3e", "wh_f3vhjg7lhwgeleccuuwl55gmva");
	});

	it("should throw authentication error", async () => {
		nock("https://api.sandbox.checkout.com")
			.post("/events/evt_hxkvhyiokc6u7bd6mlo5u4dg3e/webhooks/wh_f3vhjg7lhwgeleccuuwl55gmva/retry")
			.reply(202);

		const evt = new events('sk_test_43ed9a7f-4799-461d-b201-a70507878b51', {
			timeout: 4000,
			environment: Environment.Sandbox
		});

		try {
			const outcome = await evt.retry("evt_hxkvhyiokc6u7bd6mlo5u4dg3e", "wh_f3vhjg7lhwgeleccuuwl55gmva");
		} catch (err) {
			const error = err as AuthenticationError;
			expect(err).to.be.instanceOf(AuthenticationError)
		}
	});

	it("should throw not found error", async () => {
		nock("https://api.sandbox.checkout.com")
			.post("/events/evt_hxkvhyiokc6u7bd6mlo5u4dg3e/webhooks/wh_f3vhjg7lhwgeleccuuwl55gmva/retry")
			.reply(404);

		const evt = new events('sk_test_43ed9a7f-4799-461d-b201-a70507878b51', {
			timeout: 4000,
			environment: Environment.Sandbox
		});

		try {
			const outcome = await evt.retry("evt_hxkvhyiokc6u7bd6mlo5u4dg3e", "wh_f3vhjg7lhwgeleccuuwl55gmva");
		} catch (err) {
			const error = err as NotFoundError;
			expect(err).to.be.instanceOf(NotFoundError)
		}
	});
});

describe("Retry all webhooks", async () => {
	it("should retry event notification ", async () => {
		nock("https://api.sandbox.checkout.com")
			.post("/events/evt_hxkvhyiokc6u7bd6mlo5u4dg3e/webhooks/retry")
			.reply(202);

		const evt = new events('sk_test_43ed9a7f-4799-461d-b201-a70507878b51', {
			timeout: 4000,
			environment: Environment.Sandbox
		});
		const outcome = await evt.retryAll("evt_hxkvhyiokc6u7bd6mlo5u4dg3e");
	});

	it("should throw authentication error", async () => {
		nock("https://api.sandbox.checkout.com")
			.post("/events/evt_hxkvhyiokc6u7bd6mlo5u4dg3e/webhooks/retry")
			.reply(202);

		const evt = new events('sk_test_43ed9a7f-4799-461d-b201-a70507878b51', {
			timeout: 4000,
			environment: Environment.Sandbox
		});

		try {
			const outcome = await evt.retryAll("evt_hxkvhyiokc6u7bd6mlo5u4dg3e");
		} catch (err) {
			const error = err as AuthenticationError;
			expect(err).to.be.instanceOf(AuthenticationError)
		}
	});

	it("should throw not found error", async () => {
		nock("https://api.sandbox.checkout.com")
			.post("/events/evt_hxkvhyiokc6u7bd6mlo5u4dg3e/webhooks/retry")
			.reply(404);

		const evt = new events('sk_test_43ed9a7f-4799-461d-b201-a70507878b51', {
			timeout: 4000,
			environment: Environment.Sandbox
		});

		try {
			const outcome = await evt.retryAll("evt_hxkvhyiokc6u7bd6mlo5u4dg3e");
		} catch (err) {
			const error = err as NotFoundError;
			expect(err).to.be.instanceOf(NotFoundError)
		}
	});
});