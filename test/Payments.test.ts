import { expect } from 'chai'
import payments from '../src/payments/Payments';
import { Http, CardSource, Environment } from '../src/index'
const nock = require("nock");

describe("Payments", async () => {
	it("should create instance of payments class with a HTTP configuration", async () => {
		const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
		expect(pay).to.be.instanceOf(payments);
		expect(pay.key).to.equal('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
		expect(pay.configuration.timeout).to.equal(5000);
	});

	it("should set http configuration and key in constructor", async () => {
		const cnf = new Http
		const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51', {
			timeout: 4000,
			environment: Environment.Sandbox
		});
		expect(pay.key).to.equal('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
		expect(pay.configuration.timeout).to.equal(4000);
	});

	it("should set http configuration and key with parameter", async () => {
		const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');

		pay.configuration = {
			timeout: 4000,
			environment: Environment.Sandbox
		};

		pay.key = 'sk_test_43ed9a7f-4799-461d-b201-a70507878b51';

		expect(pay.key).to.equal('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
		expect(pay.configuration.timeout).to.equal(4000);
	});

	it("should perform normal payment request with a Card Source", async () => {
		nock("https://api.sandbox.checkout.com")
			.post("/payments")
			.reply(201, {
				isPending: [Function],
				id: 'pay_6ndp5facelxurne7gloxkxm57u',
				action_id: 'act_6ndp5facelxurne7gloxkxm57u',
				amount: 100,
				currency: 'USD',
				approved: true,
				status: 'Authorized',
				auth_code: '277368',
				response_code: '10000',
				response_summary: 'Approved',
				'3ds': undefined,
				risk: { flagged: false },
				source:
				{
					id: 'src_mtagg5kktcoerkwloibzfuilpy',
					type: 'card',
					expiry_month: 6,
					expiry_year: 2029,
					scheme: 'Visa',
					last4: '4242',
					fingerprint:
						'107A352DFAE35E3EEBA5D0856FCDFB88ECF91E8CFDE4275ABBC791FD9579AB2C',
					bin: '424242',
					card_type: 'Credit',
					card_category: 'Consumer',
					issuer: 'JPMORGAN CHASE BANK NA',
					issuer_country: 'US',
					product_id: 'A',
					product_type: 'Visa Traditional',
					avs_check: 'S',
					cvv_check: 'Y'
				},
				customer: { id: 'cus_leu5pp2zshpuvbt6yjxl5xcrdi' },
				processed_on: '2019-06-09T22:43:54Z',
				reference: undefined,
				eci: '05',
				scheme_id: '638284745624527',
				_links:
				{
					self:
					{
						href:
							'https://api.sandbox.checkout.com/payments/pay_6ndp5facelxurne7gloxkxm57u'
					},
					actions:
					{
						href:
							'https://api.sandbox.checkout.com/payments/pay_6ndp5facelxurne7gloxkxm57u/actions'
					},
					capture:
					{
						href:
							'https://api.sandbox.checkout.com/payments/pay_6ndp5facelxurne7gloxkxm57u/captures'
					},
					void:
					{
						href:
							'https://api.sandbox.checkout.com/payments/pay_6ndp5facelxurne7gloxkxm57u/voids'
					}
				}
			});

		const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');

		let transaction = await pay.request<CardSource>({
			source: new CardSource({
				number: "4242424242424242",
				expiry_month: "06",
				expiry_year: "2029",
				cvv: "100"
			}),
			currency: "USD",
			amount: 100
		});
		expect(transaction.approved).to.be.true;
		expect(transaction.risk.flagged).to.be.false;
		expect(transaction._links.redirect).to.be.undefined;
	});

	it("should perform 3dS payment request with a Card Source", async () => {
		nock("https://api.sandbox.checkout.com")
			.post("/payments")
			.reply(202, {
				"id": "pay_y3oqhf46pyzuxjbcn2giaqnb44",
				"status": "Pending",
				"reference": "ORD-5023-4E89",
				"customer": {
					"id": "cus_y3oqhf46pyzuxjbcn2giaqnb44",
					"email": "jokershere@gmail.com",
					"name": "Jack Napier"
				},
				"3ds": {
					"downgraded": false,
					"enrolled": "Y"
				},
				"_links": {
					"self": {},
					"redirect": {}
				}
			});

		const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');

		let transaction = await pay.request<CardSource>({
			source: new CardSource({
				number: "4242424242424242",
				expiry_month: "06",
				expiry_year: "2029",
				cvv: "100"
			}),
			currency: "USD",
			amount: 100,
			'3ds': {
				enabled: true
			}
		});
		expect(transaction.isPending()).to.be.true;
		expect(transaction.status).to.equal('Pending');
	});

	it("should decline payment request with a Card Source", async () => {
		nock("https://api.sandbox.checkout.com")
			.post("/payments")
			.reply(201, {
				isPending: [Function],
				id: 'pay_idt2rgacxglehoyhiu7fu3e4we',
				action_id: 'act_idt2rgacxglehoyhiu7fu3e4we',
				amount: 1005,
				currency: 'USD',
				approved: false,
				status: 'Declined',
				auth_code: '000000',
				response_code: '20005',
				response_summary: 'Declined - Do Not Honour',
				'3ds': undefined,
				risk: { flagged: false },
				source:
				{
					type: 'card',
					expiry_month: 6,
					expiry_year: 2029,
					scheme: 'Visa',
					last4: '4242',
					fingerprint:
						'107A352DFAE35E3EEBA5D0856FCDFB88ECF91E8CFDE4275ABBC791FD9579AB2C',
					bin: '424242',
					card_type: 'Credit',
					card_category: 'Consumer',
					issuer: 'JPMORGAN CHASE BANK NA',
					issuer_country: 'US',
					product_id: 'A',
					product_type: 'Visa Traditional',
					avs_check: 'S',
					cvv_check: 'Y'
				},
				customer: { id: 'cus_xthycmncbhmujauqjebmhwkwle' },
				processed_on: '2019-06-09T22:54:00Z',
				reference: undefined,
				eci: '05',
				scheme_id: '638284745624527',
				_links:
				{
					self:
					{
						href:
							'https://api.sandbox.checkout.com/payments/pay_idt2rgacxglehoyhiu7fu3e4we'
					},
					actions:
					{
						href:
							'https://api.sandbox.checkout.com/payments/pay_idt2rgacxglehoyhiu7fu3e4we/actions'
					}
				}
			});

		const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');

		let transaction = await pay.request<CardSource>({
			source: new CardSource({
				number: "4242424242424242",
				expiry_month: "06",
				expiry_year: "2029",
				cvv: "100"
			}),
			currency: "USD",
			amount: 1005,
		});

		expect(transaction.approved).to.be.false;
		expect(transaction.status).to.equal('Declined');
		expect(transaction.status).to.equal('Declined');
	});

	it("should timeout payment request with a Card Source", async () => {
		nock("https://api.sandbox.checkout.com")
			.post("/payments")
			.delay(20)
			.reply(201, {});

		try {
			const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
			pay.configuration = {
				timeout: 10,
				environment: Environment.Sandbox
			}
			let transaction = await pay.request<CardSource>({
				source: new CardSource({
					number: "4242424242424242",
					expiry_month: "06",
					expiry_year: "2029",
					cvv: "100"
				}),
				currency: "USD",
				amount: 1005,
			});
		} catch (err) {
			expect(err.name).to.equal('ApiTimeout');
		}
	});

	it("should error out with API Error for payment request with a Card Source", async () => {
		nock("https://api.sandbox.checkout.com")
			.post("/payments")
			.reply(500, {
				error: 'error'
			});

		try {
			const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');

			let transaction = await pay.request<CardSource>({
				source: new CardSource({
					number: "4242424242424242",
					expiry_month: "06",
					expiry_year: "2029",
					cvv: "100"
				}),
				currency: "USD",
				amount: 1005,
			});
		} catch (err) {
			expect(err.name).to.equal('API Error');
		}
	});
});
