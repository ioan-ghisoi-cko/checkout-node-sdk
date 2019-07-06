import { expect } from 'chai'
import checkout from '../src/index';
import { Environment } from '../src';
import {
	ValidationError,
	BadGateway,
} from '../src/models/response/HttpErrors';
const nock = require("nock");

describe("Checkout", async () => {
	it("should create instance of checkout sdk with a HTTP configuration", async () => {
		const cko = new checkout('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
		cko.setHttpConfiguration({
			timeout: 4000,
			environment: Environment.Sandbox
		});
		expect(cko).to.be.instanceOf(checkout);
		expect(cko.payments.key).to.equal('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
		expect(cko.sources.key).to.equal('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
		expect(cko.httpConfiguration.timeout).to.equal(4000);
		expect(cko.payments.httpConfiguration.timeout).to.equal(4000);
		expect(cko.payments.httpConfiguration.timeout).to.equal(4000);
	});

	it("should be able to set the public key", async () => {
		const cko = new checkout();
		cko.setPublicKey('pk_test_123')
		expect(cko.tokens.key).to.equal('pk_test_123');
	});

	it("should be able to set the secret key", async () => {
		const cko = new checkout();
		cko.setSecretKey('sk_test_43ed9a7f-4799-461d-b201-a70507878b51')
		expect(cko.key).to.equal('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
		expect(cko.payments.key).to.equal('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
		expect(cko.sources.key).to.equal('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
	});
});