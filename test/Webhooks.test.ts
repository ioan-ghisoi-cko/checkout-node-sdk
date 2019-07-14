import { expect } from 'chai'
import tokens from '../src/api/Tokens';
import { Environment, CardSource, ApplePaySource, GooglePaySource, NoWebhooksConfigured } from '../src';
import {
	ApiError,
	ApiTimeout,
	AuthenticationError,
	ValidationError,
	TooManyRequestsError,
	BadGateway,
	NotFoundError,
	ActionNotAllowed,
	UrlAlreadyRegistered
} from '../src/models/response/HttpErrors';
import webhook from '../src/api/Webhooks';
const nock = require("nock");

describe("Retrieve webhooks", async () => {
	it("should create instance of Webhooks class with a HTTP configuration", async () => {
		const hook = new webhook('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
		expect(hook).to.be.instanceOf(webhook);
		expect(hook.key).to.equal('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
		expect(hook.httpConfiguration.timeout).to.equal(5000);
	});

	it("should set http configuration and key in constructor", async () => {
		const hook = new webhook('sk_test_43ed9a7f-4799-461d-b201-a70507878b51', {
			timeout: 4000,
			environment: Environment.Sandbox
		});
		expect(hook.key).to.equal('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
		expect(hook.httpConfiguration.timeout).to.equal(4000);
	});

	it("should set http configuration and key with parameter", async () => {
		const hook = new webhook('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');

		hook.httpConfiguration = {
			timeout: 4000,
			environment: Environment.Sandbox
		};

		hook.key = 'sk_test_43ed9a7f-4799-461d-b201-a70507878b51';

		expect(hook.key).to.equal('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
		expect(hook.httpConfiguration.timeout).to.equal(4000);
	});

	it("should retrive webhook", async () => {
		nock("https://api.sandbox.checkout.com")
			.get("/webhooks")
			.reply(200,
				[{
					id: 'wh_f3vhjg7lhwgeleccuuwl55gmva',
					url: 'http://requestbin.fullcontact.com/1nk9ip41',
					active: true,
					headers: [Object],
					content_type: 'json',
					event_types: [Array],
					_links: [Object]
				}]
			);

		const hook = new webhook('sk_test_43ed9a7f-4799-461d-b201-a70507878b51', {
			timeout: 4000,
			environment: Environment.Sandbox
		});

		let outcome = await hook.retrieveWebhooks();
		expect(outcome.instances[0].active).to.be.true;
		expect(outcome.instances[0].id).to.equal("wh_f3vhjg7lhwgeleccuuwl55gmva")
	});

	it("should throw not configured error", async () => {
		nock("https://api.sandbox.checkout.com")
			.get("/webhooks")
			.reply(204);

		const hook = new webhook('sk_test_43ed9a7f-4799-461d-b201-a70507878b51', {
			timeout: 4000,
			environment: Environment.Sandbox
		});

		try {
			let outcome = await hook.retrieveWebhooks();
		} catch (error) {
			const err = error as NoWebhooksConfigured;
			expect(err).to.be.instanceOf(NoWebhooksConfigured)
			expect(error.http_code).to.equal(204);

		}
	});

	it("should throw authentication error", async () => {
		nock("https://api.sandbox.checkout.com")
			.get("/webhooks")
			.reply(401);

		const hook = new webhook('sk_test_43ed9a7f-4799-461d-b201-a70507878b51', {
			timeout: 4000,
			environment: Environment.Sandbox
		});

		try {
			let outcome = await hook.retrieveWebhooks();

		} catch (err) {
			const error = err as AuthenticationError;
			expect(err).to.be.instanceOf(AuthenticationError)
		}
	});
});

describe("Register webhook", async () => {
	it("should throw authentication error", async () => {
		nock("https://api.sandbox.checkout.com")
			.post("/webhooks")
			.reply(201, {
				id: "wh_387ac7a83a054e37ae140105429d76b5",
				url: 'http://test.com/webhook',
				active: true,
				headers: {
					authorization: "1234"
				},
				content_type: 'json',
				event_types: [
					"payment_approved",
					"payment_flagged",
					"payment_pending",
					"payment_declined",
					"payment_expired",
					"payment_cancelled",
					"payment_voided",
					"payment_void_declined",
					"payment_captured",
					"payment_capture_declined",
					"payment_capture_pending",
					"payment_refunded",
					"payment_refund_declined",
					"payment_refund_pending"
				],
				_links: {
					self: {
						href: "https://api.checkout.com/webhooks/wh_387ac7a83a054e37ae140105429d76b5"
					}
				}
			});

		const hook = new webhook('sk_test_43ed9a7f-4799-461d-b201-a70507878b51', {
			timeout: 4000,
			environment: Environment.Sandbox
		});

		let outcome = await hook.register({
			url: 'http://test.com/webhook',
			active: true,
			headers: {
				authorization: "1234"
			},
			content_type: 'json',
			event_types: [
				"payment_approved",
				"payment_flagged",
				"payment_pending",
				"payment_declined",
				"payment_expired",
				"payment_cancelled",
				"payment_voided",
				"payment_void_declined",
				"payment_captured",
				"payment_capture_declined",
				"payment_capture_pending",
				"payment_refunded",
				"payment_refund_declined",
				"payment_refund_pending"
			]
		});
		expect(outcome.url).to.equal('http://test.com/webhook');
		expect(outcome.headers.authorization).to.equal('1234');
	});

	it("should throw authentication error", async () => {
		nock("https://api.sandbox.checkout.com")
			.post("/webhooks")
			.reply(401);

		const hook = new webhook('sk_test_43ed9a7f-4799-461d-b201-a70507878b51', {
			timeout: 4000,
			environment: Environment.Sandbox
		});

		try {
			let outcome = await hook.register({
				url: 'http://test.com/webhook',
				active: true,
				headers: {
					authorization: "1234"
				},
				content_type: 'json',
				event_types: [
					"payment_approved",
					"payment_flagged",
					"payment_pending",
					"payment_declined",
					"payment_expired",
					"payment_cancelled",
					"payment_voided",
					"payment_void_declined",
					"payment_captured",
					"payment_capture_declined",
					"payment_capture_pending",
					"payment_refunded",
					"payment_refund_declined",
					"payment_refund_pending"
				]
			});

		} catch (err) {
			const error = err as AuthenticationError;
			expect(err).to.be.instanceOf(AuthenticationError)
		}
	});

	it("should throw URL already registered error", async () => {
		nock("https://api.sandbox.checkout.com")
			.post("/webhooks")
			.reply(409);

		const hook = new webhook('sk_test_43ed9a7f-4799-461d-b201-a70507878b51', {
			timeout: 4000,
			environment: Environment.Sandbox
		});

		try {
			let outcome = await hook.register({
				url: 'http://test.com/webhook',
				active: true,
				headers: {
					authorization: "1234"
				},
				content_type: 'json',
				event_types: [
					"payment_approved",
					"payment_flagged",
					"payment_pending",
					"payment_declined",
					"payment_expired",
					"payment_cancelled",
					"payment_voided",
					"payment_void_declined",
					"payment_captured",
					"payment_capture_declined",
					"payment_capture_pending",
					"payment_refunded",
					"payment_refund_declined",
					"payment_refund_pending"
				]
			});

		} catch (err) {
			const error = err as UrlAlreadyRegistered;
			expect(err).to.be.instanceOf(UrlAlreadyRegistered)
		}
	});

	it("should throw validation error", async () => {
		nock("https://api.sandbox.checkout.com")
			.post("/webhooks")
			.reply(422);

		const hook = new webhook('sk_test_43ed9a7f-4799-461d-b201-a70507878b51', {
			timeout: 4000,
			environment: Environment.Sandbox
		});

		try {
			let outcome = await hook.register({
				url: 'http://test.com/webhook',
				active: true,
				headers: {
					authorization: "1234"
				},
				content_type: 'json',
				event_types: [
					"payment_approved",
					"payment_flagged",
					"payment_pending",
					"payment_declined",
					"payment_expired",
					"payment_cancelled",
					"payment_voided",
					"payment_void_declined",
					"payment_captured",
					"payment_capture_declined",
					"payment_capture_pending",
					"payment_refunded",
					"payment_refund_declined",
					"payment_refund_pending"
				]
			});

		} catch (err) {
			expect(err).to.be.instanceOf(ValidationError)
		}
	});
});

describe("Retrieve webhook", async () => {
	it("should retrieve webhook", async () => {
		nock("https://api.sandbox.checkout.com")
			.get("/webhooks/wh_387ac7a83a054e37ae140105429d76b5")
			.reply(200, {
				url: 'http://test.com/webhook',
				active: true,
				headers: {
					authorization: "1234"
				},
				content_type: 'json',
				event_types: [
					"payment_approved",
					"payment_flagged",
					"payment_pending",
					"payment_declined",
					"payment_expired",
					"payment_cancelled",
					"payment_voided",
					"payment_void_declined",
					"payment_captured",
					"payment_capture_declined",
					"payment_capture_pending",
					"payment_refunded",
					"payment_refund_declined",
					"payment_refund_pending"
				]
			});

		const hook = new webhook('sk_test_43ed9a7f-4799-461d-b201-a70507878b51', {
			timeout: 4000,
			environment: Environment.Sandbox
		});

		let outcome = await hook.retrieveWebhook("wh_387ac7a83a054e37ae140105429d76b5");
		expect(outcome.url).to.equal('http://test.com/webhook');
		expect(outcome.headers.authorization).to.equal('1234');
	});

	it("should throw authentication error", async () => {
		nock("https://api.sandbox.checkout.com")
			.get("/webhooks/wh_387ac7a83a054e37ae140105429d76b5")
			.reply(401);

		const hook = new webhook('sk_test_43ed9a7f-4799-461d-b201-a70507878b51', {
			timeout: 4000,
			environment: Environment.Sandbox
		});

		try {
			let outcome = await hook.retrieveWebhook('wh_387ac7a83a054e37ae140105429d76b5');

		} catch (err) {
			const error = err as AuthenticationError;
			expect(err).to.be.instanceOf(AuthenticationError)
		}
	});

	it("should throw not found error", async () => {
		nock("https://api.sandbox.checkout.com")
			.get("/webhooks/wh_387ac7a83a054e37ae140105429d76b5")
			.reply(404);

		const hook = new webhook('sk_test_43ed9a7f-4799-461d-b201-a70507878b51', {
			timeout: 4000,
			environment: Environment.Sandbox
		});

		try {
			let outcome = await hook.retrieveWebhook('wh_387ac7a83a054e37ae140105429d76b5');

		} catch (err) {
			const error = err as NotFoundError;
			expect(err).to.be.instanceOf(NotFoundError)
		}
	});
});

describe("Update webhook", async () => {
	it("should update webhook", async () => {
		nock("https://api.sandbox.checkout.com")
			.put("/webhooks/wh_c7v25q36lxeuvl3bjksr5ybbhu")
			.reply(200, {
				"url": "http://requestbin.fullcontact.com/ysvfvyys",
				"active": true,
				"headers": {
					"Authorization": "12345"
				},
				"content_type": "json",
				"event_types": [
					"card_verification_declined",
					"card_verified",
					"dispute_canceled",
					"dispute_evidence_required",
					"dispute_expired",
					"dispute_lost",
					"dispute_resolved",
					"dispute_won",
					"payment_approved",
					"payment_canceled",
					"payment_capture_declined",
					"payment_capture_pending",
					"payment_captured",
					"payment_chargeback",
					"payment_declined",
					"payment_expired",
					"payment_pending",
					"payment_refund_declined",
					"payment_refund_pending",
					"payment_refunded",
					"payment_retrieval",
					"payment_void_declined",
					"payment_voided",
					"source_updated"
				]
			});

		const hook = new webhook('sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f808', {
			timeout: 4000,
			environment: Environment.Sandbox
		});

		let outcome = await hook.update("wh_c7v25q36lxeuvl3bjksr5ybbhu", {
			"url": "http://requestbin.fullcontact.com/ysvfvyys",
			"active": true,
			"headers": {
				"Authorization": "12345"
			},
			"content_type": "json",
			"event_types": [
				"card_verification_declined",
				"card_verified",
				"dispute_canceled",
				"dispute_evidence_required",
				"dispute_expired",
				"dispute_lost",
				"dispute_resolved",
				"dispute_won",
				"payment_approved",
				"payment_canceled",
				"payment_capture_declined",
				"payment_capture_pending",
				"payment_captured",
				"payment_chargeback",
				"payment_declined",
				"payment_expired",
				"payment_pending",
				"payment_refund_declined",
				"payment_refund_pending",
				"payment_refunded",
				"payment_retrieval",
				"payment_void_declined",
				"payment_voided",
				"source_updated"
			]
		});
		expect(outcome.headers.Authorization).to.equal('12345');
	});

	it("should throw authentication error", async () => {
		nock("https://api.sandbox.checkout.com")
			.put("/webhooks/wh_c7v25q36lxeuvl3bjksr5ybbhu")
			.reply(401);

		const hook = new webhook('sk_test_43ed9a7f-4799-461d-b201-a70507878b51', {
			timeout: 4000,
			environment: Environment.Sandbox
		});

		try {
			let outcome = await hook.update("wh_c7v25q36lxeuvl3bjksr5ybbhu", {
				"url": "http://requestbin.fullcontact.com/ysvfvyys",
				"active": true,
				"headers": {
					"Authorization": "12345"
				},
				"content_type": "json",
				"event_types": [
					"card_verification_declined",
					"card_verified",
					"dispute_canceled",
					"dispute_evidence_required",
					"dispute_expired",
					"dispute_lost",
					"dispute_resolved",
					"dispute_won",
					"payment_approved",
					"payment_canceled",
					"payment_capture_declined",
					"payment_capture_pending",
					"payment_captured",
					"payment_chargeback",
					"payment_declined",
					"payment_expired",
					"payment_pending",
					"payment_refund_declined",
					"payment_refund_pending",
					"payment_refunded",
					"payment_retrieval",
					"payment_void_declined",
					"payment_voided",
					"source_updated"
				]
			});
		} catch (err) {
			const error = err as AuthenticationError;
			expect(err).to.be.instanceOf(AuthenticationError)
		}
	});

	it("should throw not found error", async () => {
		nock("https://api.sandbox.checkout.com")
			.put("/webhooks/wh_c7v25q36lxeuvl3bjksr5ybbhu")
			.reply(404);

		const hook = new webhook('sk_test_43ed9a7f-4799-461d-b201-a70507878b51', {
			timeout: 4000,
			environment: Environment.Sandbox
		});

		try {
			let outcome = await hook.update("wh_c7v25q36lxeuvl3bjksr5ybbhu", {
				"url": "http://requestbin.fullcontact.com/ysvfvyys",
				"active": true,
				"headers": {
					"Authorization": "12345"
				},
				"content_type": "json",
				"event_types": [
					"card_verification_declined",
					"card_verified",
					"dispute_canceled",
					"dispute_evidence_required",
					"dispute_expired",
					"dispute_lost",
					"dispute_resolved",
					"dispute_won",
					"payment_approved",
					"payment_canceled",
					"payment_capture_declined",
					"payment_capture_pending",
					"payment_captured",
					"payment_chargeback",
					"payment_declined",
					"payment_expired",
					"payment_pending",
					"payment_refund_declined",
					"payment_refund_pending",
					"payment_refunded",
					"payment_retrieval",
					"payment_void_declined",
					"payment_voided",
					"source_updated"
				]
			});
		} catch (err) {
			const error = err as NotFoundError;
			expect(err).to.be.instanceOf(NotFoundError)
		}
	});

	it("should throw already registered error", async () => {
		nock("https://api.sandbox.checkout.com")
			.put("/webhooks/wh_c7v25q36lxeuvl3bjksr5ybbhu")
			.reply(409);

		const hook = new webhook('sk_test_43ed9a7f-4799-461d-b201-a70507878b51', {
			timeout: 4000,
			environment: Environment.Sandbox
		});

		try {
			let outcome = await hook.update("wh_c7v25q36lxeuvl3bjksr5ybbhu", {
				"url": "http://requestbin.fullcontact.com/ysvfvyys",
				"active": true,
				"headers": {
					"Authorization": "12345"
				},
				"content_type": "json",
				"event_types": [
					"card_verification_declined",
					"card_verified",
					"dispute_canceled",
					"dispute_evidence_required",
					"dispute_expired",
					"dispute_lost",
					"dispute_resolved",
					"dispute_won",
					"payment_approved",
					"payment_canceled",
					"payment_capture_declined",
					"payment_capture_pending",
					"payment_captured",
					"payment_chargeback",
					"payment_declined",
					"payment_expired",
					"payment_pending",
					"payment_refund_declined",
					"payment_refund_pending",
					"payment_refunded",
					"payment_retrieval",
					"payment_void_declined",
					"payment_voided",
					"source_updated"
				]
			});
		} catch (err) {
			const error = err as UrlAlreadyRegistered;
			expect(err).to.be.instanceOf(UrlAlreadyRegistered)
		}
	});

	it("should throw already registered error", async () => {
		nock("https://api.sandbox.checkout.com")
			.put("/webhooks/wh_c7v25q36lxeuvl3bjksr5ybbhu")
			.reply(422, {
				"request_id": "0HL80RJLS76I7",
				"error_type": "request_invalid",
				"error_codes": [
					"payment_source_required"
				]
			});

		const hook = new webhook('sk_test_43ed9a7f-4799-461d-b201-a70507878b51', {
			timeout: 4000,
			environment: Environment.Sandbox
		});

		try {
			let outcome = await hook.update("wh_c7v25q36lxeuvl3bjksr5ybbhu", {
				"url": "http://requestbin.fullcontact.com/ysvfvyys",
				"active": true,
				"headers": {
					"Authorization": "12345"
				},
				"content_type": "json",
				"event_types": [
					"card_verification_declined",
					"card_verified",
					"dispute_canceled",
					"dispute_evidence_required",
					"dispute_expired",
					"dispute_lost",
					"dispute_resolved",
					"dispute_won",
					"payment_approved",
					"payment_canceled",
					"payment_capture_declined",
					"payment_capture_pending",
					"payment_captured",
					"payment_chargeback",
					"payment_declined",
					"payment_expired",
					"payment_pending",
					"payment_refund_declined",
					"payment_refund_pending",
					"payment_refunded",
					"payment_retrieval",
					"payment_void_declined",
					"payment_voided",
					"source_updated"
				]
			});
		} catch (err) {
			expect(err).to.be.instanceOf(ValidationError)
		}
	});
});

describe("Partially update webhook", async () => {
	it("should partially update webhook", async () => {
		nock("https://api.sandbox.checkout.com")
			.patch("/webhooks/wh_c7v25q36lxeuvl3bjksr5ybbhu")
			.reply(200, {
				"url": "http://requestbin.fullcontact.com/ysvfvyys",
				"active": true,
				"headers": {
					"Authorization": "12345"
				},
				"content_type": "json",
				"event_types": [
					"card_verification_declined",
					"card_verified",
					"dispute_canceled",
					"dispute_evidence_required",
					"dispute_expired",
					"dispute_lost",
					"dispute_resolved",
					"dispute_won",
					"payment_approved",
					"payment_canceled",
					"payment_capture_declined",
					"payment_capture_pending",
					"payment_captured",
					"payment_chargeback",
					"payment_declined",
					"payment_expired",
					"payment_pending",
					"payment_refund_declined",
					"payment_refund_pending",
					"payment_refunded",
					"payment_retrieval",
					"payment_void_declined",
					"payment_voided",
					"source_updated"
				]
			});

		const hook = new webhook('sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f808', {
			timeout: 4000,
			environment: Environment.Sandbox
		});

		try {

		} catch (er) {
			console.log(er)
		}
		let outcome = await hook.partialUpdate("wh_c7v25q36lxeuvl3bjksr5ybbhu", {
			"url": "http://requestbin.fullcontact.com/ysvfvyys",
			"active": true,
			"headers": {
				"Authorization": "12345"
			},
			"content_type": "json",
			"event_types": [
				"card_verification_declined",
				"card_verified",
				"dispute_canceled",
				"dispute_evidence_required",
				"dispute_expired",
				"dispute_lost",
				"dispute_resolved",
				"dispute_won",
				"payment_approved",
				"payment_canceled",
				"payment_capture_declined",
				"payment_capture_pending",
				"payment_captured",
				"payment_chargeback",
				"payment_declined",
				"payment_expired",
				"payment_pending",
				"payment_refund_declined",
				"payment_refund_pending",
				"payment_refunded",
				"payment_retrieval",
				"payment_void_declined",
				"payment_voided",
				"source_updated"
			]
		});
		expect(outcome.headers.Authorization).to.equal('12345');
	});

	it("should throw authentication error", async () => {
		nock("https://api.sandbox.checkout.com")
			.patch("/webhooks/wh_c7v25q36lxeuvl3bjksr5ybbhu")
			.reply(401);

		const hook = new webhook('sk_test_43ed9a7f-4799-461d-b201-a70507878b51', {
			timeout: 4000,
			environment: Environment.Sandbox
		});

		try {
			let outcome = await hook.partialUpdate("wh_c7v25q36lxeuvl3bjksr5ybbhu", {
				"url": "http://requestbin.fullcontact.com/ysvfvyys",
				"active": true,
				"headers": {
					"Authorization": "12345"
				},
				"content_type": "json",
				"event_types": [
					"card_verification_declined",
					"card_verified",
					"dispute_canceled",
					"dispute_evidence_required",
					"dispute_expired",
					"dispute_lost",
					"dispute_resolved",
					"dispute_won",
					"payment_approved",
					"payment_canceled",
					"payment_capture_declined",
					"payment_capture_pending",
					"payment_captured",
					"payment_chargeback",
					"payment_declined",
					"payment_expired",
					"payment_pending",
					"payment_refund_declined",
					"payment_refund_pending",
					"payment_refunded",
					"payment_retrieval",
					"payment_void_declined",
					"payment_voided",
					"source_updated"
				]
			});
		} catch (err) {
			const error = err as AuthenticationError;
			expect(err).to.be.instanceOf(AuthenticationError)
		}
	});

	it("should throw not found error", async () => {
		nock("https://api.sandbox.checkout.com")
			.patch("/webhooks/wh_c7v25q36lxeuvl3bjksr5ybbhu")
			.reply(404);

		const hook = new webhook('sk_test_43ed9a7f-4799-461d-b201-a70507878b51', {
			timeout: 4000,
			environment: Environment.Sandbox
		});

		try {
			let outcome = await hook.partialUpdate("wh_c7v25q36lxeuvl3bjksr5ybbhu", {
				"url": "http://requestbin.fullcontact.com/ysvfvyys",
				"active": true,
				"headers": {
					"Authorization": "12345"
				},
				"content_type": "json",
				"event_types": [
					"card_verification_declined",
					"card_verified",
					"dispute_canceled",
					"dispute_evidence_required",
					"dispute_expired",
					"dispute_lost",
					"dispute_resolved",
					"dispute_won",
					"payment_approved",
					"payment_canceled",
					"payment_capture_declined",
					"payment_capture_pending",
					"payment_captured",
					"payment_chargeback",
					"payment_declined",
					"payment_expired",
					"payment_pending",
					"payment_refund_declined",
					"payment_refund_pending",
					"payment_refunded",
					"payment_retrieval",
					"payment_void_declined",
					"payment_voided",
					"source_updated"
				]
			});
		} catch (err) {
			const error = err as NotFoundError;
			expect(err).to.be.instanceOf(NotFoundError)
		}
	});

	it("should throw already registered error", async () => {
		nock("https://api.sandbox.checkout.com")
			.patch("/webhooks/wh_c7v25q36lxeuvl3bjksr5ybbhu")
			.reply(409);

		const hook = new webhook('sk_test_43ed9a7f-4799-461d-b201-a70507878b51', {
			timeout: 4000,
			environment: Environment.Sandbox
		});

		try {
			let outcome = await hook.partialUpdate("wh_c7v25q36lxeuvl3bjksr5ybbhu", {
				"url": "http://requestbin.fullcontact.com/ysvfvyys",
				"active": true,
				"headers": {
					"Authorization": "12345"
				},
				"content_type": "json",
				"event_types": [
					"card_verification_declined",
					"card_verified",
					"dispute_canceled",
					"dispute_evidence_required",
					"dispute_expired",
					"dispute_lost",
					"dispute_resolved",
					"dispute_won",
					"payment_approved",
					"payment_canceled",
					"payment_capture_declined",
					"payment_capture_pending",
					"payment_captured",
					"payment_chargeback",
					"payment_declined",
					"payment_expired",
					"payment_pending",
					"payment_refund_declined",
					"payment_refund_pending",
					"payment_refunded",
					"payment_retrieval",
					"payment_void_declined",
					"payment_voided",
					"source_updated"
				]
			});
		} catch (err) {
			const error = err as UrlAlreadyRegistered;
			expect(err).to.be.instanceOf(UrlAlreadyRegistered)
		}
	});

	it("should throw already registered error", async () => {
		nock("https://api.sandbox.checkout.com")
			.patch("/webhooks/wh_c7v25q36lxeuvl3bjksr5ybbhu")
			.reply(422, {
				"request_id": "0HL80RJLS76I7",
				"error_type": "request_invalid",
				"error_codes": [
					"payment_source_required"
				]
			});

		const hook = new webhook('sk_test_43ed9a7f-4799-461d-b201-a70507878b51', {
			timeout: 4000,
			environment: Environment.Sandbox
		});

		try {
			let outcome = await hook.partialUpdate("wh_c7v25q36lxeuvl3bjksr5ybbhu", {
				"url": "http://requestbin.fullcontact.com/ysvfvyys",
				"active": true,
				"headers": {
					"Authorization": "12345"
				},
				"content_type": "json",
				"event_types": [
					"card_verification_declined",
					"card_verified",
					"dispute_canceled",
					"dispute_evidence_required",
					"dispute_expired",
					"dispute_lost",
					"dispute_resolved",
					"dispute_won",
					"payment_approved",
					"payment_canceled",
					"payment_capture_declined",
					"payment_capture_pending",
					"payment_captured",
					"payment_chargeback",
					"payment_declined",
					"payment_expired",
					"payment_pending",
					"payment_refund_declined",
					"payment_refund_pending",
					"payment_refunded",
					"payment_retrieval",
					"payment_void_declined",
					"payment_voided",
					"source_updated"
				]
			});
		} catch (err) {
			expect(err).to.be.instanceOf(ValidationError)
		}
	});
});




describe("Remove webhook", async () => {
	it("should remove webhook", async () => {
		nock("https://api.sandbox.checkout.com")
			.delete("/webhooks/wh_c7v25q36lxeuvl3bjksr5ybbhu")
			.reply(204);

		const hook = new webhook('sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f808', {
			timeout: 4000,
			environment: Environment.Sandbox
		});
		let outcome = await hook.remove("wh_c7v25q36lxeuvl3bjksr5ybbhu");
	});

	it("should throw authentication error", async () => {
		nock("https://api.sandbox.checkout.com")
			.delete("/webhooks/wh_c7v25q36lxeuvl3bjksr5ybbhu")
			.reply(401);

		const hook = new webhook('sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f808', {
			timeout: 4000,
			environment: Environment.Sandbox
		});
		try {
			let outcome = await hook.remove("wh_c7v25q36lxeuvl3bjksr5ybbhu");
		} catch (err) {
			const error = err as AuthenticationError;
			expect(err).to.be.instanceOf(AuthenticationError)
		}
	});

	it("should throw not found error", async () => {
		nock("https://api.sandbox.checkout.com")
			.delete("/webhooks/wh_c7v25q36lxeuvl3bjksr5ybbhu")
			.reply(404);

		const hook = new webhook('sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f808', {
			timeout: 4000,
			environment: Environment.Sandbox
		});
		try {
			let outcome = await hook.remove("wh_c7v25q36lxeuvl3bjksr5ybbhu");
		} catch (err) {
			const error = err as NotFoundError;
			expect(err).to.be.instanceOf(NotFoundError)
		}
	});


});