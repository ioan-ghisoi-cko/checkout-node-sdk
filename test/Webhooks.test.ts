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