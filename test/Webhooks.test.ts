import { expect } from 'chai'
import tokens from '../src/api/Tokens';
import { Environment, CardSource, ApplePaySource, GooglePaySource } from '../src';
import {
	ApiError,
	ApiTimeout,
	AuthenticationError,
	ValidationError,
	TooManyRequestsError,
	BadGateway,
	NotFoundError,
	ActionNotAllowed,
	NotConfiguredError
} from '../src/models/response/HttpErrors';
import webhook from '../src/api/Webhooks';
const nock = require("nock");

describe("Webhooks", async () => {
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

		let outcome = await hook.retrieve();
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
			let outcome = await hook.retrieve();
		} catch (error) {
			const err = error as NotConfiguredError;
			expect(err).to.be.instanceOf(NotConfiguredError)
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
			let outcome = await hook.retrieve();

		} catch (err) {
			const error = err as AuthenticationError;
			expect(err).to.be.instanceOf(AuthenticationError)
		}
	});
});