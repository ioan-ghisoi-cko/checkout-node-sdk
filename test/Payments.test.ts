import { expect } from 'chai'
import payments from '../src/api/Payments';
import {
    Http,
    CardSource,
    Environment,
    TokenSource,
    IdSource,
    CustomerSource,
    NetworkTokenSource,
    AlipaySource,
    BoletoSource,
    BancontactSource,
    EpsSource,
    FawrySource,
    GiropaySource,
    IdealSource,
    KlarnaSource,
    KnetSource,
    PoliSource,
    QpaySource,
    SofortSource,
    CardDestination,
    TokenDestination,
    IdDestination
} from '../src/index';
import {
    AuthenticationError,
    ValidationError,
    TooManyRequestsError,
    BadGateway,
    NotFoundError,
    ActionNotAllowed,
} from '../src/models/response/HttpErrors';

const nock = require("nock");

describe("Request Payment with card source", async () => {
    it("should create instance of payments class with a HTTP configuration", async () => {
        const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
        expect(pay).to.be.instanceOf(payments);
        expect(pay.key).to.equal('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
        expect(pay.httpConfiguration.timeout).to.equal(5000);
    });

    it("should set http configuration and key in constructor", async () => {
        const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51', {
            timeout: 4000,
            environment: Environment.Sandbox
        });
        expect(pay.key).to.equal('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
        expect(pay.httpConfiguration.timeout).to.equal(4000);
    });

    it("should set http configuration and key with parameter", async () => {
        const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');

        pay.httpConfiguration = {
            timeout: 4000,
            environment: Environment.Sandbox
        };

        pay.key = 'sk_test_43ed9a7f-4799-461d-b201-a70507878b51';

        expect(pay.key).to.equal('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
        expect(pay.httpConfiguration.timeout).to.equal(4000);
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
                expiry_month: 6,
                expiry_year: 2029,
                cvv: "100"
            }),
            currency: "USD",
            amount: 100
        });
        expect(transaction.isCompleted()).to.be.true;
        expect(transaction.isFlagged()).to.be.false;
        expect(transaction.requiresRedirect()).to.be.false;
        expect(transaction.isCompleted()).to.be.true;
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
                expiry_month: 6,
                expiry_year: 2029,
                cvv: "100"
            }),
            currency: "USD",
            amount: 100,
            '3ds': {
                enabled: true
            }
        });
        expect(transaction.isCompleted()).to.be.false;
        expect(transaction.isFlagged()).to.be.false;
        expect(transaction.requiresRedirect()).to.be.true;
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
                expiry_month: 6,
                expiry_year: 2029,
                cvv: "100"
            }),
            currency: "USD",
            amount: 1005,
        });

        expect(transaction.isCompleted()).to.be.false;
        expect(transaction.isFlagged()).to.be.false;
        expect(transaction.requiresRedirect()).to.be.false;
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
            pay.httpConfiguration = {
                timeout: 10,
                environment: Environment.Sandbox
            }
            let transaction = await pay.request<CardSource>({
                source: new CardSource({
                    number: "4242424242424242",
                    expiry_month: 6,
                    expiry_year: 2029,
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
                    expiry_month: 6,
                    expiry_year: 2029,
                    cvv: "100"
                }),
                currency: "USD",
                amount: 1005,
            });
        } catch (err) {
            expect(err.name).to.equal('API Error');
        }
    });

    it("should throw AuthenticationError", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(401);
        const http = new Http();

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');

            let transaction = await pay.request<CardSource>({
                source: new CardSource({
                    number: "4242424242424242",
                    expiry_month: 6,
                    expiry_year: 2029,
                    cvv: "100"
                }),
                currency: "USD",
                amount: 1005,
            });
        } catch (err) {
            expect(err.name).to.equal('AuthenticationError');
        }
    });

    it("should throw ValidationError", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(422, {
                "request_id": "0HL80RJLS76I7",
                "error_type": "request_invalid",
                "error_codes": [
                    "payment_source_required"
                ]
            });
        const http = new Http();
        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');

            let transaction = await pay.request<CardSource>({
                source: new CardSource({
                    number: "4242424242424242",
                    expiry_month: 6,
                    expiry_year: 2029,
                    cvv: "100"
                }),
                currency: "USD",
                amount: 1005,
            });
        } catch (err) {
            expect(err).to.be.instanceOf(ValidationError)
        }
    });

    it("should throw TooManyRequestsError", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(429, {
                "request_id": "0HL80RJLS76I7",
                "error_type": "request_invalid",
                "error_codes": [
                    "payment_source_required"
                ]
            });
        const http = new Http();

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');

            let transaction = await pay.request<CardSource>({
                source: new CardSource({
                    number: "4242424242424242",
                    expiry_month: 6,
                    expiry_year: 2029,
                    cvv: "100"
                }),
                currency: "USD",
                amount: 1005,
            });
        } catch (err) {
            expect(err).to.be.instanceOf(TooManyRequestsError)
        }
    });

    it("should throw BadGateway", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(502);
        const http = new Http();

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');

            let transaction = await pay.request<CardSource>({
                source: new CardSource({
                    number: "4242424242424242",
                    expiry_month: 6,
                    expiry_year: 2029,
                    cvv: "100"
                }),
                currency: "USD",
                amount: 1005,
            });
        } catch (err) {
            expect(err).to.be.instanceOf(BadGateway)
        }
    });

});

describe("Get payment details", async () => {
    it("should get payment details with payment id", async () => {
        nock("https://api.sandbox.checkout.com")
            .get("/payments/pay_hw5ly47dkyvuhea6lh4wln6wmy")
            .reply(200, {
                "id": "pay_hw5ly47dkyvuhea6lh4wln6wmy",
                "requested_on": "2019-06-17T01:22:33Z",
                "source": {
                    "id": "src_k4mcvtv7krlutm523iccedknuu",
                    "type": "card",
                    "expiry_month": 8,
                    "expiry_year": 2025,
                    "name": "Sarah Mitchell",
                    "scheme": "Mastercard",
                    "last4": "1465",
                    "fingerprint": "EF6107604AE20CB5EE03BE1FB3066234343D40DA23F0FCF1178C74383E55AB09",
                    "bin": "519999",
                    "card_type": "Credit",
                    "card_category": "Consumer",
                    "issuer": "BANCO COOPERATIVO DE PUERTO RICO",
                    "issuer_country": "PR",
                    "product_id": "MCS",
                    "product_type": "Standard MasterCard® Card",
                    "avs_check": "S",
                    "cvv_check": "Y"
                },
                "amount": 2000,
                "currency": "USD",
                "payment_type": "Regular",
                "reference": "ORD-5023-4E89",
                "status": "Captured",
                "approved": true,
                "risk": {
                    "flagged": false
                },
                "customer": {
                    "id": "cus_ln3y5gsi7haunau2cryg3kbnka",
                    "name": "Sarah Mitchell"
                },
                "billing_descriptor": {
                    "name": "",
                    "city": "Port Louis"
                },
                "eci": "05",
                "scheme_id": "638284745624527",
                "_links": {
                    "self": {
                        "href": "https://api.sandbox.checkout.com/payments/pay_hw5ly47dkyvuhea6lh4wln6wmy"
                    },
                    "actions": {
                        "href": "https://api.sandbox.checkout.com/payments/pay_hw5ly47dkyvuhea6lh4wln6wmy/actions"
                    },
                    "refund": {
                        "href": "https://api.sandbox.checkout.com/payments/pay_hw5ly47dkyvuhea6lh4wln6wmy/refunds"
                    }
                }
            });

        const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
        pay.httpConfiguration = {
            timeout: 2000,
            environment: Environment.Sandbox
        }
        let transaction = await pay.get("pay_hw5ly47dkyvuhea6lh4wln6wmy");

        expect(transaction.id).to.equal('pay_hw5ly47dkyvuhea6lh4wln6wmy');
    });

    it("should throw authentication error", async () => {
        nock("https://api.sandbox.checkout.com")
            .get("/payments/pay_hw5ly47dkyvuhea6lh4wln6wmy")
            .reply(401, {});

        try {
            const pay = new payments('sk_test_error');
            pay.httpConfiguration = {
                timeout: 2000,
                environment: Environment.Sandbox
            }
            let transaction = await pay.get("pay_hw5ly47dkyvuhea6lh4wln6wmy");
        } catch (err) {
            const error = err as AuthenticationError;
            expect(err).to.be.instanceOf(AuthenticationError)
        }
    });

    it("should throw payment not found error", async () => {
        nock("https://api.sandbox.checkout.com")
            .get("/payments/pay_test")
            .reply(404);

        try {
            const pay = new payments('sk_test_error');
            pay.httpConfiguration = {
                timeout: 2000,
                environment: Environment.Sandbox
            }
            let transaction = await pay.get("pay_test");
        } catch (err) {
            const error = err as NotFoundError;
            expect(err).to.be.instanceOf(NotFoundError)
        }
    });
});

describe("Get payment actions", async () => {
    it("should get payment actions", async () => {
        nock("https://api.sandbox.checkout.com")
            .get("/payments/pay_6ndp5facelxurne7gloxkxm57u/actions")
            .reply(200, [{
                id: 'act_k55kvyhahyzevadsrnqob7i3am',
                type: 'Capture',
                processed_on: '2019-06-09T22:43:55Z',
                amount: 100,
                approved: true,
                response_code: '10000',
                response_summary: 'Approved',
                processing:
                {
                    acquirer_transaction_id: '8137597746',
                    acquirer_reference_number: '000007571039'
                },
                metadata: { sdk: 'node' }
            },
            {
                id: 'act_6ndp5facelxurne7gloxkxm57u',
                type: 'Authorization',
                processed_on: '2019-06-09T22:43:54Z',
                amount: 100,
                approved: true,
                auth_code: '277368',
                response_code: '10000',
                response_summary: 'Approved',
                processing:
                {
                    acquirer_transaction_id: '8137597745',
                    retrieval_reference_number: '000277368160'
                },
                metadata: { sdk: 'node' }
            }]);

        const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
        pay.httpConfiguration = {
            timeout: 2000,
            environment: Environment.Sandbox
        }
        let actions = await pay.getActions("pay_6ndp5facelxurne7gloxkxm57u");
        expect(actions.length).to.equal(2);
    });

    it("should throw AuthenticationError", async () => {
        nock("https://api.sandbox.checkout.com")
            .get("/payments/pay_6ndp5facelxurne7gloxkxm57u/actions")
            .reply(401);

        const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
        pay.httpConfiguration = {
            timeout: 2000,
            environment: Environment.Sandbox
        }
        try {
            let actions = await pay.getActions("pay_6ndp5facelxurne7gloxkxm57u");
        } catch (err) {
            expect(err.name).to.equal('AuthenticationError');
        }
    });

    it("should throw payment not found error", async () => {
        nock("https://api.sandbox.checkout.com")
            .get("/payments/pay_6ndp5facelxurne7gloxkxm57u/actions")
            .reply(404);

        const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
        pay.httpConfiguration = {
            timeout: 2000,
            environment: Environment.Sandbox
        }
        try {
            let actions = await pay.getActions("pay_6ndp5facelxurne7gloxkxm57u");
        } catch (err) {
            const error = err as NotFoundError;
            expect(err).to.be.instanceOf(NotFoundError)
        }
    });
});

describe("Capture payment", async () => {
    it("should capture payment", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments/pay_7enxra4adw6evgalvfabl6nbqy/captures")
            .reply(202, {
                "action_id": "act_sdsnnv4ehjeujmvgby6rldgmw4",
                "reference": "ORD-5023-4E89",
                "_links": {
                    "payment": {
                        "href": "https://api.sandbox.checkout.com/payments/pay_gwqbb7qbjiee3edqmyk3dme64i"
                    }
                }
            });

        const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
        pay.httpConfiguration = {
            timeout: 2000,
            environment: Environment.Sandbox
        }
        let captured = await pay.capture("pay_7enxra4adw6evgalvfabl6nbqy");
        expect(captured.action_id).to.equal("act_sdsnnv4ehjeujmvgby6rldgmw4");
        expect(captured.reference).to.equal("ORD-5023-4E89");
    });

    it("should partial capture with request body", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments/pay_7enxra4adw6evgalvfabl6nbqy/captures")
            .reply(202, (uri, requestBody) => {
                return {
                    action_id: "",
                    reference: requestBody.reference,
                    "_links": {
                        "payment": {
                            "href": "https://api.sandbox.checkout.com/payments/pay_aawyswqytsne7p76b7rhc3dhhq"
                        }
                    }
                };
            })

        const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
        pay.httpConfiguration = {
            timeout: 2000,
            environment: Environment.Sandbox
        }
        let captured = await pay.capture(
            "pay_7enxra4adw6evgalvfabl6nbqy",
            {
                amount: 1000,
                reference: "johnny",
                metadata: {
                    test: "test"
                }
            }
        );
        expect(captured.reference).to.equal("johnny");
    });

    it("should throw AuthenticationError", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments/pay_7enxra4adw6evgalvfabl6nbqy/captures")
            .reply(401);

        const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
        pay.httpConfiguration = {
            timeout: 2000,
            environment: Environment.Sandbox
        }
        try {
            let captured = await pay.capture("pay_7enxra4adw6evgalvfabl6nbqy");
        } catch (err) {
            expect(err.name).to.equal('AuthenticationError');
        }
    });

    it("should throw Capture not allowed error", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments/pay_7enxra4adw6evgalvfabl6nbqy/captures")
            .reply(403);

        const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
        pay.httpConfiguration = {
            timeout: 2000,
            environment: Environment.Sandbox
        }
        try {
            let captured = await pay.capture("pay_7enxra4adw6evgalvfabl6nbqy");
        } catch (err) {
            const error = err as ActionNotAllowed;
            expect(err).to.be.instanceOf(ActionNotAllowed)
        }
    });

    it("should throw payment not found error", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments/pay_7enxra4adw6evgalvfabl6nbqy/captures")
            .reply(404);

        const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
        pay.httpConfiguration = {
            timeout: 2000,
            environment: Environment.Sandbox
        }
        try {
            let captured = await pay.capture("pay_7enxra4adw6evgalvfabl6nbqy");
        } catch (err) {
            const error = err as NotFoundError;
            expect(err).to.be.instanceOf(NotFoundError)
        }
    });

    it("should throw BadGateway error", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments/pay_7enxra4adw6evgalvfabl6nbqy/captures")
            .reply(502);

        const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
        pay.httpConfiguration = {
            timeout: 2000,
            environment: Environment.Sandbox
        }
        try {
            let captured = await pay.capture("pay_7enxra4adw6evgalvfabl6nbqy");
        } catch (err) {
            const error = err as BadGateway;
            expect(err).to.be.instanceOf(BadGateway)
        }
    });

    it("should throw Validation error", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments/pay_7enxra4adw6evgalvfabl6nbqy/captures")
            .reply(422);

        const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
        pay.httpConfiguration = {
            timeout: 2000,
            environment: Environment.Sandbox
        }
        try {
            let captured = await pay.capture("pay_7enxra4adw6evgalvfabl6nbqy");
        } catch (err) {
            const error = err as ValidationError;
            expect(err).to.be.instanceOf(ValidationError)
        }
    });
});

describe("Refund payment", async () => {
    it("should refund payment", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments/pay_g3iiulu3idzuxcxjck6fljuaby/refunds")
            .reply(202, {
                action_id: 'act_ovvzmw73zuuunat65lbboq5sb4',
                reference: 'ORD-5023-4E89',
                links:
                {
                    payment:
                    {
                        href:
                            'https://api.sandbox.checkout.com/payments/pay_g3iiulu3idzuxcxjck6fljuaby'
                    }
                }
            });

        const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
        pay.httpConfiguration = {
            timeout: 2000,
            environment: Environment.Sandbox
        }
        let refund = await pay.refund("pay_g3iiulu3idzuxcxjck6fljuaby");
        expect(refund.action_id).to.equal("act_ovvzmw73zuuunat65lbboq5sb4");
        expect(refund.reference).to.equal("ORD-5023-4E89");
    });

    it("should partial refund with request body", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments/pay_7enxra4adw6evgalvfabl6nbqy/refunds")
            .reply(202, (uri, requestBody) => {
                return {
                    action_id: "",
                    reference: requestBody.reference,
                    "_links": {
                        "payment": {
                            "href": "https://api.sandbox.checkout.com/payments/pay_aawyswqytsne7p76b7rhc3dhhq"
                        }
                    }
                };
            })

        const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
        pay.httpConfiguration = {
            timeout: 2000,
            environment: Environment.Sandbox
        }
        let refund = await pay.refund(
            "pay_7enxra4adw6evgalvfabl6nbqy",
            {
                amount: 1000,
                reference: "johnny",
                metadata: {
                    test: "test"
                }
            }
        );
        expect(refund.reference).to.equal("johnny");
    });

    it("should throw AuthenticationError", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments/pay_7enxra4adw6evgalvfabl6nbqy/refunds")
            .reply(401);

        const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
        pay.httpConfiguration = {
            timeout: 2000,
            environment: Environment.Sandbox
        }
        try {
            let refund = await pay.refund("pay_7enxra4adw6evgalvfabl6nbqy");
        } catch (err) {
            expect(err.name).to.equal('AuthenticationError');
        }
    });

    it("should throw Capture not allowed error", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments/pay_7enxra4adw6evgalvfabl6nbqy/refunds")
            .reply(403);

        const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
        pay.httpConfiguration = {
            timeout: 2000,
            environment: Environment.Sandbox
        }
        try {
            let refund = await pay.refund("pay_7enxra4adw6evgalvfabl6nbqy");
        } catch (err) {
            const error = err as ActionNotAllowed;
            expect(err).to.be.instanceOf(ActionNotAllowed)
        }
    });

    it("should throw payment not found error", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments/pay_7enxra4adw6evgalvfabl6nbqy/refunds")
            .reply(404);

        const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
        pay.httpConfiguration = {
            timeout: 2000,
            environment: Environment.Sandbox
        }
        try {
            let refund = await pay.refund("pay_7enxra4adw6evgalvfabl6nbqy");
        } catch (err) {
            const error = err as NotFoundError;
            expect(err).to.be.instanceOf(NotFoundError)
        }
    });

    it("should throw BadGateway error", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments/pay_7enxra4adw6evgalvfabl6nbqy/refunds")
            .reply(502);

        const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
        pay.httpConfiguration = {
            timeout: 2000,
            environment: Environment.Sandbox
        }
        try {
            let refund = await pay.refund("pay_7enxra4adw6evgalvfabl6nbqy");
        } catch (err) {
            const error = err as BadGateway;
            expect(err).to.be.instanceOf(BadGateway)
        }
    });

    it("should throw Validation error", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments/pay_7enxra4adw6evgalvfabl6nbqy/refunds")
            .reply(422);

        const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
        pay.httpConfiguration = {
            timeout: 2000,
            environment: Environment.Sandbox
        }
        try {
            let refund = await pay.refund("pay_7enxra4adw6evgalvfabl6nbqy");
        } catch (err) {
            const error = err as ValidationError;
            expect(err).to.be.instanceOf(ValidationError)
        }
    });
});

describe("Void payment", async () => {
    it("should refund payment", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments/pay_g3iiulu3idzuxcxjck6fljuaby/voids")
            .reply(202, {
                action_id: 'act_ovvzmw73zuuunat65lbboq5sb4',
                reference: 'ORD-5023-4E89',
                links:
                {
                    payment:
                    {
                        href:
                            'https://api.sandbox.checkout.com/payments/pay_g3iiulu3idzuxcxjck6fljuaby'
                    }
                }
            });

        const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
        pay.httpConfiguration = {
            timeout: 2000,
            environment: Environment.Sandbox
        }
        let voidAction = await pay.void("pay_g3iiulu3idzuxcxjck6fljuaby");
        expect(voidAction.action_id).to.equal("act_ovvzmw73zuuunat65lbboq5sb4");
        expect(voidAction.reference).to.equal("ORD-5023-4E89");
    });

    it("should partial refund with request body", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments/pay_7enxra4adw6evgalvfabl6nbqy/voids")
            .reply(202, (uri, requestBody) => {
                return {
                    action_id: "",
                    reference: requestBody.reference,
                    "_links": {
                        "payment": {
                            "href": "https://api.sandbox.checkout.com/payments/pay_aawyswqytsne7p76b7rhc3dhhq"
                        }
                    }
                };
            })

        const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
        pay.httpConfiguration = {
            timeout: 2000,
            environment: Environment.Sandbox
        }
        let voidAction = await pay.void(
            "pay_7enxra4adw6evgalvfabl6nbqy",
            {
                reference: "johnny",
                metadata: {
                    test: "test"
                }
            }
        );
        expect(voidAction.reference).to.equal("johnny");
    });

    it("should throw AuthenticationError", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments/pay_7enxra4adw6evgalvfabl6nbqy/voids")
            .reply(401);

        const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
        pay.httpConfiguration = {
            timeout: 2000,
            environment: Environment.Sandbox
        }
        try {
            let voidAction = await pay.void("pay_7enxra4adw6evgalvfabl6nbqy");
        } catch (err) {
            expect(err.name).to.equal('AuthenticationError');
        }
    });

    it("should throw Capture not allowed error", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments/pay_7enxra4adw6evgalvfabl6nbqy/voids")
            .reply(403);

        const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
        pay.httpConfiguration = {
            timeout: 2000,
            environment: Environment.Sandbox
        }
        try {
            let voidAction = await pay.void("pay_7enxra4adw6evgalvfabl6nbqy");
        } catch (err) {
            const error = err as ActionNotAllowed;
            expect(err).to.be.instanceOf(ActionNotAllowed)
        }
    });

    it("should throw payment not found error", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments/pay_7enxra4adw6evgalvfabl6nbqy/voids")
            .reply(404);

        const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
        pay.httpConfiguration = {
            timeout: 2000,
            environment: Environment.Sandbox
        }
        try {
            let voidAction = await pay.void("pay_7enxra4adw6evgalvfabl6nbqy");
        } catch (err) {
            const error = err as NotFoundError;
            expect(err).to.be.instanceOf(NotFoundError)
        }
    });

    it("should throw BadGateway error", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments/pay_7enxra4adw6evgalvfabl6nbqy/voids")
            .reply(502);

        const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
        pay.httpConfiguration = {
            timeout: 2000,
            environment: Environment.Sandbox
        }
        try {
            let voidAction = await pay.void("pay_7enxra4adw6evgalvfabl6nbqy");
        } catch (err) {
            const error = err as BadGateway;
            expect(err).to.be.instanceOf(BadGateway)
        }
    });

    it("should throw Validation error", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments/pay_7enxra4adw6evgalvfabl6nbqy/voids")
            .reply(422);

        const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
        pay.httpConfiguration = {
            timeout: 2000,
            environment: Environment.Sandbox
        }
        try {
            let voidAction = await pay.void("pay_7enxra4adw6evgalvfabl6nbqy");
        } catch (err) {
            const error = err as ValidationError;
            expect(err).to.be.instanceOf(ValidationError)
        }
    });
});

describe("Request Payment with token source", async () => {

    it("should perform normal payment request with a Token Source", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(201, {
                isPending: [Function],
                id: 'pay_s44rxo5y5u7ulbsi5dyg23in24',
                action_id: 'act_s44rxo5y5u7ulbsi5dyg23in24',
                amount: 100,
                currency: 'USD',
                approved: true,
                status: 'Authorized',
                auth_code: '908603',
                response_code: '10000',
                response_summary: 'Approved',
                '3ds': undefined,
                risk: { flagged: false },
                source:
                {
                    id: 'src_3zeom6j6gx6ehkkz3weeektvaa',
                    type: 'card',
                    expiry_month: 6,
                    expiry_year: 2028,
                    scheme: 'Visa',
                    last4: '4242',
                    fingerprint: '35D40AFFDC82BCAC9890181E14655B05D8924C0B4986D29F99D13946A3B59513',
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
                customer: { id: 'cus_myjw7hyjhmyefbfw5a3zb6rqhe' },
                processed_on: '2019-07-29T11:16:11Z',
                reference: undefined,
                eci: '05',
                scheme_id: '638284745624527',
                _links:
                {
                    self: { href: 'https://api.sandbox.checkout.com/payments/pay_s44rxo5y5u7ulbsi5dyg23in24' },
                    actions: { href: 'https://api.sandbox.checkout.com/payments/pay_s44rxo5y5u7ulbsi5dyg23in24/actions' },
                    capture: { href: 'https://api.sandbox.checkout.com/payments/pay_s44rxo5y5u7ulbsi5dyg23in24/captures' },
                    void: { href: 'https://api.sandbox.checkout.com/payments/pay_s44rxo5y5u7ulbsi5dyg23in24/voids' }
                }
            });

        const pay = new payments('sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f808');

        let transaction = await pay.request<TokenSource>({
            source: new TokenSource({
                token: "tok_6dvfwja4i4ie3djvvb2gb7djue"
            }),
            currency: "USD",
            amount: 100
        });

        expect(transaction.approved).to.be.true;
        expect(transaction.risk.flagged).to.be.false;
        expect(transaction._links.redirect).to.be.undefined;
    });

    it("should perform 3dS payment request with a Token Source", async () => {
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

        let transaction = await pay.request<TokenSource>({
            source: new TokenSource({
                token: "tok_6dvfwja4i4ie3djvvb2gb7djue"
            }),
            currency: "USD",
            amount: 100,
            '3ds': {
                enabled: true
            }
        });
        expect(transaction.requiresRedirect()).to.be.true;
        expect(transaction.status).to.equal('Pending');
    });

    it("should decline payment request with a Token Source", async () => {
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

        let transaction = await pay.request<TokenSource>({
            source: new TokenSource({
                token: "tok_6dvfwja4i4ie3djvvb2gb7djue"
            }),
            currency: "USD",
            amount: 1005,
        });

        expect(transaction.approved).to.be.false;
        expect(transaction.status).to.equal('Declined');
        expect(transaction.status).to.equal('Declined');
    });

    it("should timeout payment request with a Token Source", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .delay(20)
            .reply(201, {});

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
            pay.httpConfiguration = {
                timeout: 10,
                environment: Environment.Sandbox
            }
            let transaction = await pay.request<TokenSource>({
                source: new TokenSource({
                    token: "tok_6dvfwja4i4ie3djvvb2gb7djue"
                }),
                currency: "USD",
                amount: 1005,
            });
        } catch (err) {
            expect(err.name).to.equal('ApiTimeout');
        }
    });

    it("should error out with API Error for payment request with a Token Source", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(500, {
                error: 'error'
            });

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');

            let transaction = await pay.request<TokenSource>({
                source: new TokenSource({
                    token: "tok_6dvfwja4i4ie3djvvb2gb7djue"
                }),
                currency: "USD",
                amount: 1005,
            });
        } catch (err) {
            expect(err.name).to.equal('API Error');
        }
    });

    it("should throw AuthenticationError", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(401);
        const http = new Http();

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');

            let transaction = await pay.request<TokenSource>({
                source: new TokenSource({
                    token: "tok_6dvfwja4i4ie3djvvb2gb7djue"
                }),
                currency: "USD",
                amount: 1005,
            });
        } catch (err) {
            expect(err.name).to.equal('AuthenticationError');
        }
    });

    it("should throw ValidationError", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(422, {
                "request_id": "0HL80RJLS76I7",
                "error_type": "request_invalid",
                "error_codes": [
                    "payment_source_required"
                ]
            });
        const http = new Http();
        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');

            let transaction = await pay.request<TokenSource>({
                source: new TokenSource({
                    token: "tok_6dvfwja4i4ie3djvvb2gb7djue"
                }),
                currency: "USD",
                amount: 1005,
            });
        } catch (err) {
            expect(err).to.be.instanceOf(ValidationError)
        }
    });

    it("should throw TooManyRequestsError", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(429, {
                "request_id": "0HL80RJLS76I7",
                "error_type": "request_invalid",
                "error_codes": [
                    "payment_source_required"
                ]
            });
        const http = new Http();

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');

            let transaction = await pay.request<TokenSource>({
                source: new TokenSource({
                    token: "tok_6dvfwja4i4ie3djvvb2gb7djue"
                }),
                currency: "USD",
                amount: 1005,
            });
        } catch (err) {
            expect(err).to.be.instanceOf(TooManyRequestsError)
        }
    });

    it("should throw BadGateway", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(502);
        const http = new Http();

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');

            let transaction = await pay.request<TokenSource>({
                source: new TokenSource({
                    token: "tok_6dvfwja4i4ie3djvvb2gb7djue"
                }),
                currency: "USD",
                amount: 1005,
            });
        } catch (err) {
            expect(err).to.be.instanceOf(BadGateway)
        }
    });
});

describe("Request Payment with token source", async () => {

    it("should perform normal payment request with a Id Source", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(201, {
                isPending: [Function],
                id: 'pay_s44rxo5y5u7ulbsi5dyg23in24',
                action_id: 'act_s44rxo5y5u7ulbsi5dyg23in24',
                amount: 100,
                currency: 'USD',
                approved: true,
                status: 'Authorized',
                auth_code: '908603',
                response_code: '10000',
                response_summary: 'Approved',
                '3ds': undefined,
                risk: { flagged: false },
                source:
                {
                    id: 'src_3zeom6j6gx6ehkkz3weeektvaa',
                    type: 'card',
                    expiry_month: 6,
                    expiry_year: 2028,
                    scheme: 'Visa',
                    last4: '4242',
                    fingerprint: '35D40AFFDC82BCAC9890181E14655B05D8924C0B4986D29F99D13946A3B59513',
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
                customer: { id: 'cus_myjw7hyjhmyefbfw5a3zb6rqhe' },
                processed_on: '2019-07-29T11:16:11Z',
                reference: undefined,
                eci: '05',
                scheme_id: '638284745624527',
                _links:
                {
                    self: { href: 'https://api.sandbox.checkout.com/payments/pay_s44rxo5y5u7ulbsi5dyg23in24' },
                    actions: { href: 'https://api.sandbox.checkout.com/payments/pay_s44rxo5y5u7ulbsi5dyg23in24/actions' },
                    capture: { href: 'https://api.sandbox.checkout.com/payments/pay_s44rxo5y5u7ulbsi5dyg23in24/captures' },
                    void: { href: 'https://api.sandbox.checkout.com/payments/pay_s44rxo5y5u7ulbsi5dyg23in24/voids' }
                }
            });

        const pay = new payments('sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f808');

        let transaction = await pay.request<IdSource>({
            source: new IdSource({
                id: "src_6jofmhuzt6ne7kt73t27tg3qni"
            }),
            currency: "USD",
            amount: 100
        });

        expect(transaction.approved).to.be.true;
        expect(transaction.risk.flagged).to.be.false;
        expect(transaction._links.redirect).to.be.undefined;
    });

    it("should perform 3dS payment request with a Id Source", async () => {
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

        let transaction = await pay.request<IdSource>({
            source: new IdSource({
                id: "src_6jofmhuzt6ne7kt73t27tg3qni"
            }),
            currency: "USD",
            amount: 100,
            '3ds': {
                enabled: true
            }
        });
        expect(transaction.requiresRedirect()).to.be.true;
        expect(transaction.status).to.equal('Pending');
    });

    it("should decline payment request with a Id Source", async () => {
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

        let transaction = await pay.request<IdSource>({
            source: new IdSource({
                id: "src_6jofmhuzt6ne7kt73t27tg3qni"
            }),
            currency: "USD",
            amount: 1005,
        });

        expect(transaction.approved).to.be.false;
        expect(transaction.status).to.equal('Declined');
        expect(transaction.status).to.equal('Declined');
    });

    it("should timeout payment request with a Id Source", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .delay(20)
            .reply(201, {});

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
            pay.httpConfiguration = {
                timeout: 10,
                environment: Environment.Sandbox
            }
            let transaction = await pay.request<IdSource>({
                source: new IdSource({
                    id: "src_6jofmhuzt6ne7kt73t27tg3qni"
                }),
                currency: "USD",
                amount: 1005,
            });
        } catch (err) {
            expect(err.name).to.equal('ApiTimeout');
        }
    });

    it("should error out with API Error for payment request with a Id Source", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(500, {
                error: 'error'
            });

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');

            let transaction = await pay.request<IdSource>({
                source: new IdSource({
                    id: "src_6jofmhuzt6ne7kt73t27tg3qni"
                }),
                currency: "USD",
                amount: 1005,
            });
        } catch (err) {
            expect(err.name).to.equal('API Error');
        }
    });

    it("should throw AuthenticationError", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(401);
        const http = new Http();

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');

            let transaction = await pay.request<IdSource>({
                source: new IdSource({
                    id: "src_6jofmhuzt6ne7kt73t27tg3qni"
                }),
                currency: "USD",
                amount: 1005,
            });
        } catch (err) {
            expect(err.name).to.equal('AuthenticationError');
        }
    });

    it("should throw ValidationError", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(422, {
                "request_id": "0HL80RJLS76I7",
                "error_type": "request_invalid",
                "error_codes": [
                    "payment_source_required"
                ]
            });
        const http = new Http();
        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');

            let transaction = await pay.request<IdSource>({
                source: new IdSource({
                    id: "src_6jofmhuzt6ne7kt73t27tg3qni"
                }),
                currency: "USD",
                amount: 1005,
            });
        } catch (err) {
            expect(err).to.be.instanceOf(ValidationError)
        }
    });

    it("should throw TooManyRequestsError", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(429, {
                "request_id": "0HL80RJLS76I7",
                "error_type": "request_invalid",
                "error_codes": [
                    "payment_source_required"
                ]
            });
        const http = new Http();

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');

            let transaction = await pay.request<IdSource>({
                source: new IdSource({
                    id: "src_6jofmhuzt6ne7kt73t27tg3qni"
                }),
                currency: "USD",
                amount: 1005,
            });
        } catch (err) {
            expect(err).to.be.instanceOf(TooManyRequestsError)
        }
    });

    it("should throw BadGateway", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(502);
        const http = new Http();

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');

            let transaction = await pay.request<IdSource>({
                source: new IdSource({
                    id: "src_6jofmhuzt6ne7kt73t27tg3qni"
                }),
                currency: "USD",
                amount: 1005,
            });
        } catch (err) {
            expect(err).to.be.instanceOf(BadGateway)
        }
    });
});

describe("Request Payment with customer source", async () => {

    it("should perform normal payment request with a Customer Source", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(201, {
                isPending: [Function],
                id: 'pay_s44rxo5y5u7ulbsi5dyg23in24',
                action_id: 'act_s44rxo5y5u7ulbsi5dyg23in24',
                amount: 100,
                currency: 'USD',
                approved: true,
                status: 'Authorized',
                auth_code: '908603',
                response_code: '10000',
                response_summary: 'Approved',
                '3ds': undefined,
                risk: { flagged: false },
                source:
                {
                    id: 'src_3zeom6j6gx6ehkkz3weeektvaa',
                    type: 'card',
                    expiry_month: 6,
                    expiry_year: 2028,
                    scheme: 'Visa',
                    last4: '4242',
                    fingerprint: '35D40AFFDC82BCAC9890181E14655B05D8924C0B4986D29F99D13946A3B59513',
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
                customer: { id: 'cus_myjw7hyjhmyefbfw5a3zb6rqhe' },
                processed_on: '2019-07-29T11:16:11Z',
                reference: undefined,
                eci: '05',
                scheme_id: '638284745624527',
                _links:
                {
                    self: { href: 'https://api.sandbox.checkout.com/payments/pay_s44rxo5y5u7ulbsi5dyg23in24' },
                    actions: { href: 'https://api.sandbox.checkout.com/payments/pay_s44rxo5y5u7ulbsi5dyg23in24/actions' },
                    capture: { href: 'https://api.sandbox.checkout.com/payments/pay_s44rxo5y5u7ulbsi5dyg23in24/captures' },
                    void: { href: 'https://api.sandbox.checkout.com/payments/pay_s44rxo5y5u7ulbsi5dyg23in24/voids' }
                }
            });

        const pay = new payments('sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f808');

        let transaction = await pay.request<CustomerSource>({
            source: new CustomerSource({
                "id": "cus_ye63fc7hx3dednq47lcecjauci"
            }),
            currency: "USD",
            amount: 100
        });

        expect(transaction.approved).to.be.true;
        expect(transaction.risk.flagged).to.be.false;
        expect(transaction._links.redirect).to.be.undefined;
    });

    it("should perform 3dS payment request with a Customer Source", async () => {
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

        let transaction = await pay.request<CustomerSource>({
            source: new CustomerSource({
                "id": "cus_ye63fc7hx3dednq47lcecjauci"
            }),
            currency: "USD",
            amount: 100,
            '3ds': {
                enabled: true
            }
        });
        expect(transaction.requiresRedirect()).to.be.true;
        expect(transaction.status).to.equal('Pending');
    });

    it("should decline payment request with a Customer Source", async () => {
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

        let transaction = await pay.request<CustomerSource>({
            source: new CustomerSource({
                "id": "cus_ye63fc7hx3dednq47lcecjauci"
            }),
            currency: "USD",
            amount: 1005,
        });

        expect(transaction.approved).to.be.false;
        expect(transaction.status).to.equal('Declined');
        expect(transaction.status).to.equal('Declined');
    });

    it("should timeout payment request with a Customer Source", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .delay(20)
            .reply(201, {});

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
            pay.httpConfiguration = {
                timeout: 10,
                environment: Environment.Sandbox
            }
            let transaction = await pay.request<CustomerSource>({
                source: new CustomerSource({
                    "id": "cus_ye63fc7hx3dednq47lcecjauci"
                }),
                currency: "USD",
                amount: 1005,
            });
        } catch (err) {
            expect(err.name).to.equal('ApiTimeout');
        }
    });

    it("should error out with API Error for payment request with a Customer Source", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(500, {
                error: 'error'
            });

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');

            let transaction = await pay.request<CustomerSource>({
                source: new CustomerSource({
                    "id": "cus_ye63fc7hx3dednq47lcecjauci"
                }),
                currency: "USD",
                amount: 1005,
            });
        } catch (err) {
            expect(err.name).to.equal('API Error');
        }
    });

    it("should throw AuthenticationError", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(401);
        const http = new Http();

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');

            let transaction = await pay.request<CustomerSource>({
                source: new CustomerSource({
                    "id": "cus_ye63fc7hx3dednq47lcecjauci"
                }),
                currency: "USD",
                amount: 1005,
            });
        } catch (err) {
            expect(err.name).to.equal('AuthenticationError');
        }
    });

    it("should throw ValidationError", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(422, {
                "request_id": "0HL80RJLS76I7",
                "error_type": "request_invalid",
                "error_codes": [
                    "payment_source_required"
                ]
            });
        const http = new Http();
        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');

            let transaction = await pay.request<CustomerSource>({
                source: new CustomerSource({
                    "id": "cus_ye63fc7hx3dednq47lcecjauci"
                }),
                currency: "USD",
                amount: 1005,
            });
        } catch (err) {
            expect(err).to.be.instanceOf(ValidationError)
        }
    });

    it("should throw TooManyRequestsError", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(429, {
                "request_id": "0HL80RJLS76I7",
                "error_type": "request_invalid",
                "error_codes": [
                    "payment_source_required"
                ]
            });
        const http = new Http();

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');

            let transaction = await pay.request<CustomerSource>({
                source: new CustomerSource({
                    "id": "cus_ye63fc7hx3dednq47lcecjauci"
                }),
                currency: "USD",
                amount: 1005,
            });
        } catch (err) {
            expect(err).to.be.instanceOf(TooManyRequestsError)
        }
    });

    it("should throw BadGateway", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(502);
        const http = new Http();

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');

            let transaction = await pay.request<CustomerSource>({
                source: new CustomerSource({
                    "id": "cus_ye63fc7hx3dednq47lcecjauci"
                }),
                currency: "USD",
                amount: 1005,
            });
        } catch (err) {
            expect(err).to.be.instanceOf(BadGateway)
        }
    });
});

describe("Request Payment with network token source", async () => {

    it("should perform normal payment request with a NetworkToken Source", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(201, {
                isPending: [Function],
                id: 'pay_s44rxo5y5u7ulbsi5dyg23in24',
                action_id: 'act_s44rxo5y5u7ulbsi5dyg23in24',
                amount: 100,
                currency: 'USD',
                approved: true,
                status: 'Authorized',
                auth_code: '908603',
                response_code: '10000',
                response_summary: 'Approved',
                '3ds': undefined,
                risk: { flagged: false },
                source:
                {
                    id: 'src_3zeom6j6gx6ehkkz3weeektvaa',
                    type: 'card',
                    expiry_month: 6,
                    expiry_year: 2028,
                    scheme: 'Visa',
                    last4: '4242',
                    fingerprint: '35D40AFFDC82BCAC9890181E14655B05D8924C0B4986D29F99D13946A3B59513',
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
                customer: { id: 'cus_myjw7hyjhmyefbfw5a3zb6rqhe' },
                processed_on: '2019-07-29T11:16:11Z',
                reference: undefined,
                eci: '05',
                scheme_id: '638284745624527',
                _links:
                {
                    self: { href: 'https://api.sandbox.checkout.com/payments/pay_s44rxo5y5u7ulbsi5dyg23in24' },
                    actions: { href: 'https://api.sandbox.checkout.com/payments/pay_s44rxo5y5u7ulbsi5dyg23in24/actions' },
                    capture: { href: 'https://api.sandbox.checkout.com/payments/pay_s44rxo5y5u7ulbsi5dyg23in24/captures' },
                    void: { href: 'https://api.sandbox.checkout.com/payments/pay_s44rxo5y5u7ulbsi5dyg23in24/voids' }
                }
            });

        const pay = new payments('sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f808');

        let transaction = await pay.request<NetworkTokenSource>({
            source: new NetworkTokenSource({
                "token": "4242424242424242",
                "expiry_month": 6,
                "expiry_year": 2025,
                "token_type": "vts",
                "cryptogram": "hv8mUFzPzRZoCAAAAAEQBDMAAAA=",
                "eci": "05"
            }),
            currency: "USD",
            amount: 100
        });

        expect(transaction.approved).to.be.true;
        expect(transaction.risk.flagged).to.be.false;
        expect(transaction._links.redirect).to.be.undefined;
    });

    it("should perform 3dS payment request with a NetworkToken Source", async () => {
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

        let transaction = await pay.request<NetworkTokenSource>({
            source: new NetworkTokenSource({
                "token": "4242424242424242",
                "expiry_month": 6,
                "expiry_year": 2025,
                "token_type": "vts",
                "cryptogram": "hv8mUFzPzRZoCAAAAAEQBDMAAAA=",
                "eci": "05"
            }),
            currency: "USD",
            amount: 100,
            '3ds': {
                enabled: true
            }
        });
        expect(transaction.requiresRedirect()).to.be.true;
        expect(transaction.status).to.equal('Pending');
    });

    it("should decline payment request with a NetworkToken Source", async () => {
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

        let transaction = await pay.request<NetworkTokenSource>({
            source: new NetworkTokenSource({
                "token": "4242424242424242",
                "expiry_month": 6,
                "expiry_year": 2025,
                "token_type": "vts",
                "cryptogram": "hv8mUFzPzRZoCAAAAAEQBDMAAAA=",
                "eci": "05"
            }),
            currency: "USD",
            amount: 1005,
        });

        expect(transaction.approved).to.be.false;
        expect(transaction.status).to.equal('Declined');
        expect(transaction.status).to.equal('Declined');
    });

    it("should timeout payment request with a NetworkToken Source", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .delay(20)
            .reply(201, {});

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
            pay.httpConfiguration = {
                timeout: 10,
                environment: Environment.Sandbox
            }
            let transaction = await pay.request<NetworkTokenSource>({
                source: new NetworkTokenSource({

                    "token": "4242424242424242",
                    "expiry_month": 6,
                    "expiry_year": 2025,
                    "token_type": "vts",
                    "cryptogram": "hv8mUFzPzRZoCAAAAAEQBDMAAAA=",
                    "eci": "05"
                }),
                currency: "USD",
                amount: 1005,
            });
        } catch (err) {
            expect(err.name).to.equal('ApiTimeout');
        }
    });

    it("should error out with API Error for payment request with a NetworkToken Source", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(500, {
                error: 'error'
            });

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');

            let transaction = await pay.request<NetworkTokenSource>({
                source: new NetworkTokenSource({

                    "token": "4242424242424242",
                    "expiry_month": 6,
                    "expiry_year": 2025,
                    "token_type": "vts",
                    "cryptogram": "hv8mUFzPzRZoCAAAAAEQBDMAAAA=",
                    "eci": "05"
                }),
                currency: "USD",
                amount: 1005,
            });
        } catch (err) {
            expect(err.name).to.equal('API Error');
        }
    });

    it("should throw AuthenticationError", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(401);
        const http = new Http();

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');

            let transaction = await pay.request<NetworkTokenSource>({
                source: new NetworkTokenSource({

                    "token": "4242424242424242",
                    "expiry_month": 6,
                    "expiry_year": 2025,
                    "token_type": "vts",
                    "cryptogram": "hv8mUFzPzRZoCAAAAAEQBDMAAAA=",
                    "eci": "05"
                }),
                currency: "USD",
                amount: 1005,
            });
        } catch (err) {
            expect(err.name).to.equal('AuthenticationError');
        }
    });

    it("should throw ValidationError", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(422, {
                "request_id": "0HL80RJLS76I7",
                "error_type": "request_invalid",
                "error_codes": [
                    "payment_source_required"
                ]
            });
        const http = new Http();
        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');

            let transaction = await pay.request<NetworkTokenSource>({
                source: new NetworkTokenSource({

                    "token": "4242424242424242",
                    "expiry_month": 6,
                    "expiry_year": 2025,
                    "token_type": "vts",
                    "cryptogram": "hv8mUFzPzRZoCAAAAAEQBDMAAAA=",
                    "eci": "05"
                }),
                currency: "USD",
                amount: 1005,
            });
        } catch (err) {
            expect(err).to.be.instanceOf(ValidationError)
        }
    });

    it("should throw TooManyRequestsError", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(429, {
                "request_id": "0HL80RJLS76I7",
                "error_type": "request_invalid",
                "error_codes": [
                    "payment_source_required"
                ]
            });
        const http = new Http();

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');

            let transaction = await pay.request<NetworkTokenSource>({
                source: new NetworkTokenSource({

                    "token": "4242424242424242",
                    "expiry_month": 6,
                    "expiry_year": 2025,
                    "token_type": "vts",
                    "cryptogram": "hv8mUFzPzRZoCAAAAAEQBDMAAAA=",
                    "eci": "05"
                }),
                currency: "USD",
                amount: 1005,
            });
        } catch (err) {
            expect(err).to.be.instanceOf(TooManyRequestsError)
        }
    });

    it("should throw BadGateway", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(502);
        const http = new Http();

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');

            let transaction = await pay.request<NetworkTokenSource>({
                source: new NetworkTokenSource({
                    "token": "4242424242424242",
                    "expiry_month": 6,
                    "expiry_year": 2025,
                    "token_type": "vts",
                    "cryptogram": "hv8mUFzPzRZoCAAAAAEQBDMAAAA=",
                    "eci": "05"
                }),
                currency: "USD",
                amount: 1005,
            });
        } catch (err) {
            expect(err).to.be.instanceOf(BadGateway)
        }
    });
});

describe("Request Payment with alipay source", async () => {

    it("should perform normal payment request with a Alipay Source", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(202, {
                "id": "pay_qxkkv6kcwwfehgekufp426krja",
                "status": "Pending",
                "reference": "bill",
                "customer": {
                    "id": "cus_ah6ax2fswwmujfessvmhj6yfdu"
                },
                "_links": {
                    "self": {
                        "href": "https://api.sandbox.checkout.com/payments/pay_qxkkv6kcwwfehgekufp426krja"
                    },
                    "redirect": {
                        "href": "https://sandbox.checkout.com/LP.Core/api/payment/149272"
                    }
                }
            });

        const pay = new payments('sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f808');

        let transaction = await pay.request<AlipaySource>({
            source: new AlipaySource(),
            currency: "USD",
            amount: 100
        });

        expect(transaction.status).to.equal("Pending");
        expect(transaction.requiresRedirect()).to.be.true;
    });


    it("should timeout payment request with a Alipay Source", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .delay(20)
            .reply(201, {});

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
            pay.httpConfiguration = {
                timeout: 10,
                environment: Environment.Sandbox
            }
            let transaction = await pay.request<AlipaySource>({
                source: new AlipaySource(),
                currency: "USD",
                amount: 1005,
            });
        } catch (err) {
            expect(err.name).to.equal('ApiTimeout');
        }
    });

    it("should error out with API Error for payment request with a Alipay Source", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(500, {
                error: 'error'
            });

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
            let transaction = await pay.request<AlipaySource>({
                source: new AlipaySource(),
                currency: "USD",
                amount: 1005,
            });
        } catch (err) {
            expect(err.name).to.equal('API Error');
        }
    });

    it("should throw AuthenticationError", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(401);
        const http = new Http();

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
            let transaction = await pay.request<AlipaySource>({
                source: new AlipaySource(),
                currency: "USD",
                amount: 1005,
            });
        } catch (err) {
            expect(err.name).to.equal('AuthenticationError');
        }
    });

    it("should throw ValidationError", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(422, {
                "request_id": "0HL80RJLS76I7",
                "error_type": "request_invalid",
                "error_codes": [
                    "payment_source_required"
                ]
            });
        const http = new Http();
        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
            let transaction = await pay.request<AlipaySource>({
                source: new AlipaySource(),
                currency: "USD",
                amount: 1005,
            });
        } catch (err) {
            expect(err).to.be.instanceOf(ValidationError)
        }
    });

    it("should throw TooManyRequestsError", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(429, {
                "request_id": "0HL80RJLS76I7",
                "error_type": "request_invalid",
                "error_codes": [
                    "payment_source_required"
                ]
            });
        const http = new Http();

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
            let transaction = await pay.request<AlipaySource>({
                source: new AlipaySource(),
                currency: "USD",
                amount: 1005,
            });
        } catch (err) {
            expect(err).to.be.instanceOf(TooManyRequestsError)
        }
    });

    it("should throw BadGateway", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(502);
        const http = new Http();

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
            let transaction = await pay.request<AlipaySource>({
                source: new AlipaySource(),
                currency: "USD",
                amount: 1005,
            });
        } catch (err) {
            expect(err).to.be.instanceOf(BadGateway)
        }
    });
});

describe("Request Payment with boleto source", async () => {

    it("should perform normal payment request with a Boleto Source", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(202, {
                "id": "pay_qxkkv6kcwwfehgekufp426krja",
                "status": "Pending",
                "reference": "bill",
                "customer": {
                    "id": "cus_ah6ax2fswwmujfessvmhj6yfdu"
                },
                "_links": {
                    "self": {
                        "href": "https://api.sandbox.checkout.com/payments/pay_qxkkv6kcwwfehgekufp426krja"
                    },
                    "redirect": {
                        "href": "https://sandbox.checkout.com/LP.Core/api/payment/149272"
                    }
                }
            });

        const pay = new payments('sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f808');

        let transaction = await pay.request<BoletoSource>({
            source: new BoletoSource({
                "birthDate": "1973-11-11",
                "cpf": "00003456789",
                "customerName": "Rafael Goncalves"
            }),
            currency: "BRL",
            amount: 100
        });

        expect(transaction.status).to.equal("Pending");
        expect(transaction.requiresRedirect()).to.be.true;
    });



    it("should timeout payment request with a Boleto Source", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .delay(20)
            .reply(201, {});

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
            pay.httpConfiguration = {
                timeout: 10,
                environment: Environment.Sandbox
            }
            let transaction = await pay.request<BoletoSource>({
                source: new BoletoSource({
                    "birthDate": "1973-11-11",
                    "cpf": "00003456789",
                    "customerName": "Rafael Goncalves"
                }),
                currency: "BRL",
                amount: 1005,
            });
        } catch (err) {
            expect(err.name).to.equal('ApiTimeout');
        }
    });

    it("should error out with API Error for payment request with a Boleto Source", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(500, {
                error: 'error'
            });

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
            let transaction = await pay.request<BoletoSource>({
                source: new BoletoSource({
                    "birthDate": "1973-11-11",
                    "cpf": "00003456789",
                    "customerName": "Rafael Goncalves"
                }),
                currency: "BRL",
                amount: 1005,
            });
        } catch (err) {
            expect(err.name).to.equal('API Error');
        }
    });

    it("should throw AuthenticationError", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(401);
        const http = new Http();

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
            let transaction = await pay.request<BoletoSource>({
                source: new BoletoSource({
                    "birthDate": "1973-11-11",
                    "cpf": "00003456789",
                    "customerName": "Rafael Goncalves"
                }),
                currency: "BRL",
                amount: 1005,
            });
        } catch (err) {
            expect(err.name).to.equal('AuthenticationError');
        }
    });

    it("should throw ValidationError", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(422, {
                "request_id": "0HL80RJLS76I7",
                "error_type": "request_invalid",
                "error_codes": [
                    "payment_source_required"
                ]
            });
        const http = new Http();
        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
            let transaction = await pay.request<BoletoSource>({
                source: new BoletoSource({
                    "birthDate": "1973-11-11",
                    "cpf": "00003456789",
                    "customerName": "Rafael Goncalves"
                }),
                currency: "BRL",
                amount: 1005,
            });
        } catch (err) {
            expect(err).to.be.instanceOf(ValidationError)
        }
    });

    it("should throw TooManyRequestsError", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(429, {
                "request_id": "0HL80RJLS76I7",
                "error_type": "request_invalid",
                "error_codes": [
                    "payment_source_required"
                ]
            });
        const http = new Http();

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
            let transaction = await pay.request<BoletoSource>({
                source: new BoletoSource({
                    "birthDate": "1973-11-11",
                    "cpf": "00003456789",
                    "customerName": "Rafael Goncalves"
                }),
                currency: "BRL",
                amount: 1005,
            });
        } catch (err) {
            expect(err).to.be.instanceOf(TooManyRequestsError)
        }
    });

    it("should throw BadGateway", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(502);
        const http = new Http();

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
            let transaction = await pay.request<BoletoSource>({
                source: new BoletoSource({
                    "birthDate": "1973-11-11",
                    "cpf": "00003456789",
                    "customerName": "Rafael Goncalves"
                }),
                currency: "BRL",
                amount: 1005,
            });
        } catch (err) {
            expect(err).to.be.instanceOf(BadGateway)
        }
    });
});

describe("Request Payment with bancontact source", async () => {

    it("should perform normal payment request with a Bancontact Source", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(202, {
                "id": "pay_n6n3gepww4surejytdp4ozjoly",
                "status": "Pending",
                "customer": {
                    "id": "cus_6mg4oy74euburertf2dirrmuw4"
                },
                "_links": {
                    "self": {
                        "href": "https://api.sandbox.checkout.com/payments/pay_n6n3gepww4surejytdp4ozjoly"
                    },
                    "redirect": {
                        "href": "https://trusted.girogate.de/ti/dumbdummy?tx=486276883&rs=bTkokE0uuZv6DtH0Tb4KNJB4Y8MY0199&cs=f88e86113dd159f6c399daafb3054e43c065d6c726a1b2a4f81f481fb877f629"
                    }
                }
            });

        const pay = new payments('sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f808');

        let transaction = await pay.request<BancontactSource>({
            source: new BancontactSource({
                "account_holder_name": "Bruce Wayne",
                "payment_country": "BE",
                "billing_descriptor": "CKO Demo - bancontact"
            }),
            currency: "EUR",
            amount: 100
        });

        expect(transaction.status).to.equal("Pending");
        expect(transaction.requiresRedirect()).to.be.true;
    });



    it("should timeout payment request with a Bancontact Source", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .delay(20)
            .reply(201, {});

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
            pay.httpConfiguration = {
                timeout: 10,
                environment: Environment.Sandbox
            }
            let transaction = await pay.request<BancontactSource>({
                source: new BancontactSource({
                    "account_holder_name": "Bruce Wayne",
                    "payment_country": "BE",
                    "billing_descriptor": "CKO Demo - bancontact"
                }),
                currency: "EUR",
                amount: 1005,
            });
        } catch (err) {
            expect(err.name).to.equal('ApiTimeout');
        }
    });

    it("should error out with API Error for payment request with a Bancontact Source", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(500, {
                error: 'error'
            });

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
            let transaction = await pay.request<BancontactSource>({
                source: new BancontactSource({
                    "account_holder_name": "Bruce Wayne",
                    "payment_country": "BE",
                    "billing_descriptor": "CKO Demo - bancontact"
                }),
                currency: "EUR",
                amount: 1005,
            });
        } catch (err) {
            expect(err.name).to.equal('API Error');
        }
    });

    it("should throw AuthenticationError", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(401);
        const http = new Http();

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
            let transaction = await pay.request<BancontactSource>({
                source: new BancontactSource({
                    "account_holder_name": "Bruce Wayne",
                    "payment_country": "BE",
                    "billing_descriptor": "CKO Demo - bancontact"
                }),
                currency: "EUR",
                amount: 1005,
            });
        } catch (err) {
            expect(err.name).to.equal('AuthenticationError');
        }
    });

    it("should throw ValidationError", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(422, {
                "request_id": "0HL80RJLS76I7",
                "error_type": "request_invalid",
                "error_codes": [
                    "payment_source_required"
                ]
            });
        const http = new Http();
        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
            let transaction = await pay.request<BancontactSource>({
                source: new BancontactSource({
                    "account_holder_name": "Bruce Wayne",
                    "payment_country": "BE",
                    "billing_descriptor": "CKO Demo - bancontact"
                }),
                currency: "EUR",
                amount: 1005,
            });
        } catch (err) {
            expect(err).to.be.instanceOf(ValidationError)
        }
    });

    it("should throw TooManyRequestsError", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(429, {
                "request_id": "0HL80RJLS76I7",
                "error_type": "request_invalid",
                "error_codes": [
                    "payment_source_required"
                ]
            });
        const http = new Http();

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
            let transaction = await pay.request<BancontactSource>({
                source: new BancontactSource({
                    "account_holder_name": "Bruce Wayne",
                    "payment_country": "BE",
                    "billing_descriptor": "CKO Demo - bancontact"
                }),
                currency: "EUR",
                amount: 1005,
            });
        } catch (err) {
            expect(err).to.be.instanceOf(TooManyRequestsError)
        }
    });

    it("should throw BadGateway", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(502);
        const http = new Http();

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
            let transaction = await pay.request<BancontactSource>({
                source: new BancontactSource({
                    "account_holder_name": "Bruce Wayne",
                    "payment_country": "BE",
                    "billing_descriptor": "CKO Demo - bancontact"
                }),
                currency: "EUR",
                amount: 1005,
            });
        } catch (err) {
            expect(err).to.be.instanceOf(BadGateway)
        }
    });
});

describe("Request Payment with eps source", async () => {

    it("should perform normal payment request with a Eps Source", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(202, {
                "id": "pay_n6n3gepww4surejytdp4ozjoly",
                "status": "Pending",
                "customer": {
                    "id": "cus_6mg4oy74euburertf2dirrmuw4"
                },
                "_links": {
                    "self": {
                        "href": "https://api.sandbox.checkout.com/payments/pay_n6n3gepww4surejytdp4ozjoly"
                    },
                    "redirect": {
                        "href": "https://trusted.girogate.de/ti/dumbdummy?tx=486276883&rs=bTkokE0uuZv6DtH0Tb4KNJB4Y8MY0199&cs=f88e86113dd159f6c399daafb3054e43c065d6c726a1b2a4f81f481fb877f629"
                    }
                }
            });

        const pay = new payments('sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f808');

        let transaction = await pay.request<EpsSource>({
            source: new EpsSource({
                "purpose": "Mens black t-shirt L"
            }),
            currency: "EUR",
            amount: 100
        });

        expect(transaction.status).to.equal("Pending");
        expect(transaction.requiresRedirect()).to.be.true;
    });



    it("should timeout payment request with a Eps Source", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .delay(20)
            .reply(201, {});

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
            pay.httpConfiguration = {
                timeout: 10,
                environment: Environment.Sandbox
            }
            let transaction = await pay.request<EpsSource>({
                source: new EpsSource({
                    "purpose": "Mens black t-shirt L"
                }),
                currency: "EUR",
                amount: 1005,
            });
        } catch (err) {
            expect(err.name).to.equal('ApiTimeout');
        }
    });

    it("should error out with API Error for payment request with a Eps Source", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(500, {
                error: 'error'
            });

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
            let transaction = await pay.request<EpsSource>({
                source: new EpsSource({
                    "purpose": "Mens black t-shirt L"
                }),
                currency: "EUR",
                amount: 1005,
            });
        } catch (err) {
            expect(err.name).to.equal('API Error');
        }
    });

    it("should throw AuthenticationError", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(401);
        const http = new Http();

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
            let transaction = await pay.request<EpsSource>({
                source: new EpsSource({
                    "purpose": "Mens black t-shirt L"
                }),
                currency: "EUR",
                amount: 1005,
            });
        } catch (err) {
            expect(err.name).to.equal('AuthenticationError');
        }
    });

    it("should throw ValidationError", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(422, {
                "request_id": "0HL80RJLS76I7",
                "error_type": "request_invalid",
                "error_codes": [
                    "payment_source_required"
                ]
            });
        const http = new Http();
        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
            let transaction = await pay.request<EpsSource>({
                source: new EpsSource({
                    "purpose": "Mens black t-shirt L"
                }),
                currency: "EUR",
                amount: 1005,
            });
        } catch (err) {
            expect(err).to.be.instanceOf(ValidationError)
        }
    });

    it("should throw TooManyRequestsError", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(429, {
                "request_id": "0HL80RJLS76I7",
                "error_type": "request_invalid",
                "error_codes": [
                    "payment_source_required"
                ]
            });
        const http = new Http();

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
            let transaction = await pay.request<EpsSource>({
                source: new EpsSource({
                    "purpose": "Mens black t-shirt L"
                }),
                currency: "EUR",
                amount: 1005,
            });
        } catch (err) {
            expect(err).to.be.instanceOf(TooManyRequestsError)
        }
    });

    it("should throw BadGateway", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(502);
        const http = new Http();

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
            let transaction = await pay.request<EpsSource>({
                source: new EpsSource({
                    "purpose": "Mens black t-shirt L"
                }),
                currency: "EUR",
                amount: 1005,
            });
        } catch (err) {
            expect(err).to.be.instanceOf(BadGateway)
        }
    });
});

describe("Request Payment with fawry source", async () => {

    it("should perform normal payment request with a Fawry Source", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(202, {
                "id": "pay_xjndyxg5hm6ujfyxhn4ctdwnv4",
                "status": "Pending",
                "customer": {
                    "id": "cus_6fb5ub5rlsiehg66tbtbp64auq"
                },
                "_links": {
                    "self": {
                        "href": "https://api.sandbox.checkout.com/payments/pay_xjndyxg5hm6ujfyxhn4ctdwnv4"
                    },
                    "approve": {
                        "href": "https://api.sandbox.checkout.com/fawry/payments/1192437644/approval"
                    },
                    "cancel": {
                        "href": "https://api.sandbox.checkout.com/fawry/payments/1192437644/cancellation"
                    }
                }
            });

        const pay = new payments('sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f808');

        let transaction = await pay.request<FawrySource>({
            source: new FawrySource({
                "description": "Fawry Demo Payment",
                "customer_mobile": "0102800991193847299",
                "customer_email": "bruce@wayne-enterprises.com",
                "products": [
                    {
                        "product_id": "0123456789",
                        "quantity": 1,
                        "price": 1000,
                        "description": "Fawry Demo Product"
                    }
                ]
            }),
            currency: "EGP",
            amount: 100
        });

        expect(transaction.status).to.equal("Pending");
        expect(transaction.requiresRedirect()).to.be.true;
    });



    it("should timeout payment request with a Fawry Source", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .delay(20)
            .reply(201, {});

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
            pay.httpConfiguration = {
                timeout: 10,
                environment: Environment.Sandbox
            }
            let transaction = await pay.request<FawrySource>({
                source: new FawrySource({
                    "description": "Fawry Demo Payment",
                    "customer_mobile": "0102800991193847299",
                    "customer_email": "bruce@wayne-enterprises.com",
                    "products": [
                        {
                            "product_id": "0123456789",
                            "quantity": 1,
                            "price": 1000,
                            "description": "Fawry Demo Product"
                        }
                    ]
                }),
                currency: "EGP",
                amount: 1005,
            });
        } catch (err) {
            expect(err.name).to.equal('ApiTimeout');
        }
    });

    it("should error out with API Error for payment request with a Fawry Source", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(500, {
                error: 'error'
            });

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
            let transaction = await pay.request<FawrySource>({
                source: new FawrySource({
                    "description": "Fawry Demo Payment",
                    "customer_mobile": "0102800991193847299",
                    "customer_email": "bruce@wayne-enterprises.com",
                    "products": [
                        {
                            "product_id": "0123456789",
                            "quantity": 1,
                            "price": 1000,
                            "description": "Fawry Demo Product"
                        }
                    ]
                }),
                currency: "EGP",
                amount: 1005,
            });
        } catch (err) {
            expect(err.name).to.equal('API Error');
        }
    });

    it("should throw AuthenticationError", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(401);
        const http = new Http();

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
            let transaction = await pay.request<FawrySource>({
                source: new FawrySource({
                    "description": "Fawry Demo Payment",
                    "customer_mobile": "0102800991193847299",
                    "customer_email": "bruce@wayne-enterprises.com",
                    "products": [
                        {
                            "product_id": "0123456789",
                            "quantity": 1,
                            "price": 1000,
                            "description": "Fawry Demo Product"
                        }
                    ]
                }),
                currency: "EGP",
                amount: 1005,
            });
        } catch (err) {
            expect(err.name).to.equal('AuthenticationError');
        }
    });

    it("should throw ValidationError", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(422, {
                "request_id": "0HL80RJLS76I7",
                "error_type": "request_invalid",
                "error_codes": [
                    "payment_source_required"
                ]
            });
        const http = new Http();
        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
            let transaction = await pay.request<FawrySource>({
                source: new FawrySource({
                    "description": "Fawry Demo Payment",
                    "customer_mobile": "0102800991193847299",
                    "customer_email": "bruce@wayne-enterprises.com",
                    "products": [
                        {
                            "product_id": "0123456789",
                            "quantity": 1,
                            "price": 1000,
                            "description": "Fawry Demo Product"
                        }
                    ]
                }),
                currency: "EGP",
                amount: 1005,
            });
        } catch (err) {
            expect(err).to.be.instanceOf(ValidationError)
        }
    });

    it("should throw TooManyRequestsError", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(429, {
                "request_id": "0HL80RJLS76I7",
                "error_type": "request_invalid",
                "error_codes": [
                    "payment_source_required"
                ]
            });
        const http = new Http();

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
            let transaction = await pay.request<FawrySource>({
                source: new FawrySource({
                    "description": "Fawry Demo Payment",
                    "customer_mobile": "0102800991193847299",
                    "customer_email": "bruce@wayne-enterprises.com",
                    "products": [
                        {
                            "product_id": "0123456789",
                            "quantity": 1,
                            "price": 1000,
                            "description": "Fawry Demo Product"
                        }
                    ]
                }),
                currency: "EGP",
                amount: 1005,
            });
        } catch (err) {
            expect(err).to.be.instanceOf(TooManyRequestsError)
        }
    });

    it("should throw BadGateway", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(502);
        const http = new Http();

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
            let transaction = await pay.request<FawrySource>({
                source: new FawrySource({
                    "description": "Fawry Demo Payment",
                    "customer_mobile": "0102800991193847299",
                    "customer_email": "bruce@wayne-enterprises.com",
                    "products": [
                        {
                            "product_id": "0123456789",
                            "quantity": 1,
                            "price": 1000,
                            "description": "Fawry Demo Product"
                        }
                    ]
                }),
                currency: "EGP",
                amount: 1005,
            });
        } catch (err) {
            expect(err).to.be.instanceOf(BadGateway)
        }
    });
});

describe("Request Payment with giropay source", async () => {

    it("should perform normal payment request with a Giropay Source", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(202, {
                "id": "pay_xjndyxg5hm6ujfyxhn4ctdwnv4",
                "status": "Pending",
                "customer": {
                    "id": "cus_6fb5ub5rlsiehg66tbtbp64auq"
                },
                "_links": {
                    "self": {
                        "href": "https://api.sandbox.checkout.com/payments/pay_xjndyxg5hm6ujfyxhn4ctdwnv4"
                    },
                    "approve": {
                        "href": "https://api.sandbox.checkout.com/fawry/payments/1192437644/approval"
                    },
                    "cancel": {
                        "href": "https://api.sandbox.checkout.com/fawry/payments/1192437644/cancellation"
                    }
                }
            });

        const pay = new payments('sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f808');

        let transaction = await pay.request<GiropaySource>({
            source: new GiropaySource({
                "purpose": "Mens black t-shirt L"
            }),
            currency: "EGP",
            amount: 100
        });

        expect(transaction.status).to.equal("Pending");
        expect(transaction.requiresRedirect()).to.be.true;
    });



    it("should timeout payment request with a Giropay Source", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .delay(20)
            .reply(201, {});

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
            pay.httpConfiguration = {
                timeout: 10,
                environment: Environment.Sandbox
            }
            let transaction = await pay.request<GiropaySource>({
                source: new GiropaySource({
                    "purpose": "Mens black t-shirt L"
                }),
                currency: "EGP",
                amount: 1005,
            });
        } catch (err) {
            expect(err.name).to.equal('ApiTimeout');
        }
    });

    it("should error out with API Error for payment request with a Giropay Source", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(500, {
                error: 'error'
            });

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
            let transaction = await pay.request<GiropaySource>({
                source: new GiropaySource({
                    "purpose": "Mens black t-shirt L"
                }),
                currency: "EGP",
                amount: 1005,
            });
        } catch (err) {
            expect(err.name).to.equal('API Error');
        }
    });

    it("should throw AuthenticationError", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(401);
        const http = new Http();

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
            let transaction = await pay.request<GiropaySource>({
                source: new GiropaySource({
                    "purpose": "Mens black t-shirt L"
                }),
                currency: "EGP",
                amount: 1005,
            });
        } catch (err) {
            expect(err.name).to.equal('AuthenticationError');
        }
    });

    it("should throw ValidationError", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(422, {
                "request_id": "0HL80RJLS76I7",
                "error_type": "request_invalid",
                "error_codes": [
                    "payment_source_required"
                ]
            });
        const http = new Http();
        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
            let transaction = await pay.request<GiropaySource>({
                source: new GiropaySource({
                    "purpose": "Mens black t-shirt L"
                }),
                currency: "EGP",
                amount: 1005,
            });
        } catch (err) {
            expect(err).to.be.instanceOf(ValidationError)
        }
    });

    it("should throw TooManyRequestsError", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(429, {
                "request_id": "0HL80RJLS76I7",
                "error_type": "request_invalid",
                "error_codes": [
                    "payment_source_required"
                ]
            });
        const http = new Http();

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
            let transaction = await pay.request<GiropaySource>({
                source: new GiropaySource({
                    "purpose": "Mens black t-shirt L"
                }),
                currency: "EGP",
                amount: 1005,
            });
        } catch (err) {
            expect(err).to.be.instanceOf(TooManyRequestsError)
        }
    });

    it("should throw BadGateway", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(502);
        const http = new Http();

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
            let transaction = await pay.request<GiropaySource>({
                source: new GiropaySource({
                    "purpose": "Mens black t-shirt L"
                }),
                currency: "EGP",
                amount: 1005,
            });
        } catch (err) {
            expect(err).to.be.instanceOf(BadGateway)
        }
    });
});

describe("Request Payment with ideal source", async () => {

    it("should perform normal payment request with a iDeal Source", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(202, {
                "id": "pay_xjndyxg5hm6ujfyxhn4ctdwnv4",
                "status": "Pending",
                "customer": {
                    "id": "cus_6fb5ub5rlsiehg66tbtbp64auq"
                },
                "_links": {
                    "self": {
                        "href": "https://api.sandbox.checkout.com/payments/pay_xjndyxg5hm6ujfyxhn4ctdwnv4"
                    },
                    "approve": {
                        "href": "https://api.sandbox.checkout.com/fawry/payments/1192437644/approval"
                    },
                    "cancel": {
                        "href": "https://api.sandbox.checkout.com/fawry/payments/1192437644/cancellation"
                    }
                }
            });

        const pay = new payments('sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f808');

        let transaction = await pay.request<IdealSource>({
            source: new IdealSource({
                "bic": "INGBNL2A",
                "description": "ORD123",
                "language": "nl"
            }),
            currency: "EUR",
            amount: 100
        });

        expect(transaction.status).to.equal("Pending");
        expect(transaction.requiresRedirect()).to.be.true;
    });



    it("should timeout payment request with a iDeal Source", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .delay(20)
            .reply(201, {});

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
            pay.httpConfiguration = {
                timeout: 10,
                environment: Environment.Sandbox
            }
            let transaction = await pay.request<IdealSource>({
                source: new IdealSource({
                    "bic": "INGBNL2A",
                    "description": "ORD123",
                    "language": "nl"
                }),
                currency: "EUR",
                amount: 1005,
            });
        } catch (err) {
            expect(err.name).to.equal('ApiTimeout');
        }
    });

    it("should error out with API Error for payment request with a iDeal Source", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(500, {
                error: 'error'
            });

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
            let transaction = await pay.request<IdealSource>({
                source: new IdealSource({
                    "bic": "INGBNL2A",
                    "description": "ORD123",
                    "language": "nl"
                }),
                currency: "EUR",
                amount: 1005,
            });
        } catch (err) {
            expect(err.name).to.equal('API Error');
        }
    });

    it("should throw AuthenticationError", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(401);
        const http = new Http();

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
            let transaction = await pay.request<IdealSource>({
                source: new IdealSource({
                    "bic": "INGBNL2A",
                    "description": "ORD123",
                    "language": "nl"
                }),
                currency: "EUR",
                amount: 1005,
            });
        } catch (err) {
            expect(err.name).to.equal('AuthenticationError');
        }
    });

    it("should throw ValidationError", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(422, {
                "request_id": "0HL80RJLS76I7",
                "error_type": "request_invalid",
                "error_codes": [
                    "payment_source_required"
                ]
            });
        const http = new Http();
        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
            let transaction = await pay.request<IdealSource>({
                source: new IdealSource({
                    "bic": "INGBNL2A",
                    "description": "ORD123",
                    "language": "nl"
                }),
                currency: "EUR",
                amount: 1005,
            });
        } catch (err) {
            expect(err).to.be.instanceOf(ValidationError)
        }
    });

    it("should throw TooManyRequestsError", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(429, {
                "request_id": "0HL80RJLS76I7",
                "error_type": "request_invalid",
                "error_codes": [
                    "payment_source_required"
                ]
            });
        const http = new Http();

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
            let transaction = await pay.request<IdealSource>({
                source: new IdealSource({
                    "bic": "INGBNL2A",
                    "description": "ORD123",
                    "language": "nl"
                }),
                currency: "EUR",
                amount: 1005,
            });
        } catch (err) {
            expect(err).to.be.instanceOf(TooManyRequestsError)
        }
    });

    it("should throw BadGateway", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(502);
        const http = new Http();

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
            let transaction = await pay.request<IdealSource>({
                source: new IdealSource({
                    "bic": "INGBNL2A",
                    "description": "ORD123",
                    "language": "nl"
                }),
                currency: "EUR",
                amount: 1005,
            });
        } catch (err) {
            expect(err).to.be.instanceOf(BadGateway)
        }
    });
});

describe("Request Payment with Klarna Source", async () => {

    it("should perform normal payment request with a Klarna Source", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(202, {
                "id": "pay_xjndyxg5hm6ujfyxhn4ctdwnv4",
                "status": "Pending",
                "customer": {
                    "id": "cus_6fb5ub5rlsiehg66tbtbp64auq"
                },
                "_links": {
                    "self": {
                        "href": "https://api.sandbox.checkout.com/payments/pay_xjndyxg5hm6ujfyxhn4ctdwnv4"
                    },
                    "approve": {
                        "href": "https://api.sandbox.checkout.com/fawry/payments/1192437644/approval"
                    },
                    "cancel": {
                        "href": "https://api.sandbox.checkout.com/fawry/payments/1192437644/cancellation"
                    }
                }
            });

        const pay = new payments('sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f808');

        let transaction = await pay.request<KlarnaSource>({
            source: new KlarnaSource({
                "authorization_token": "b4bd3423-24e3",
                "locale": "en-GB",
                "purchase_country": "GB",
                "tax_amount": 0,
                "billing_address": {
                    "given_name": "John",
                    "family_name": "Doe",
                    "email": "johndoe@email.com",
                    "title": "Mr",
                    "street_address": "13 New Burlington St",
                    "street_address2": "Apt 214",
                    "postal_code": "W13 3BG",
                    "city": "London",
                    "phone": "01895808221",
                    "country": "GB"
                },
                "customer": {
                    "date_of_birth": "1970-01-01",
                    "gender": "male"
                },
                "products": [
                    {
                        "name": "Battery Power Pack",
                        "quantity": 1,
                        "unit_price": 1000,
                        "tax_rate": 0,
                        "total_amount": 1000,
                        "total_tax_amount": 0
                    }
                ]
            }),
            currency: "GBP",
            amount: 100
        });

        expect(transaction.status).to.equal("Pending");
        expect(transaction.requiresRedirect()).to.be.true;
    });



    it("should timeout payment request with a Klarna Source", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .delay(20)
            .reply(201, {});

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
            pay.httpConfiguration = {
                timeout: 10,
                environment: Environment.Sandbox
            }
            let transaction = await pay.request<KlarnaSource>({
                source: new KlarnaSource({
                    "authorization_token": "b4bd3423-24e3",
                    "locale": "en-GB",
                    "purchase_country": "GB",
                    "tax_amount": 0,
                    "billing_address": {
                        "given_name": "John",
                        "family_name": "Doe",
                        "email": "johndoe@email.com",
                        "title": "Mr",
                        "street_address": "13 New Burlington St",
                        "street_address2": "Apt 214",
                        "postal_code": "W13 3BG",
                        "city": "London",
                        "phone": "01895808221",
                        "country": "GB"
                    },
                    "customer": {
                        "date_of_birth": "1970-01-01",
                        "gender": "male"
                    },
                    "products": [
                        {
                            "name": "Battery Power Pack",
                            "quantity": 1,
                            "unit_price": 1000,
                            "tax_rate": 0,
                            "total_amount": 1000,
                            "total_tax_amount": 0
                        }
                    ]
                }),
                currency: "GBP",
                amount: 1005,
            });
        } catch (err) {
            expect(err.name).to.equal('ApiTimeout');
        }
    });

    it("should error out with API Error for payment request with a Klarna Source", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(500, {
                error: 'error'
            });

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
            let transaction = await pay.request<KlarnaSource>({
                source: new KlarnaSource({
                    "authorization_token": "b4bd3423-24e3",
                    "locale": "en-GB",
                    "purchase_country": "GB",
                    "tax_amount": 0,
                    "billing_address": {
                        "given_name": "John",
                        "family_name": "Doe",
                        "email": "johndoe@email.com",
                        "title": "Mr",
                        "street_address": "13 New Burlington St",
                        "street_address2": "Apt 214",
                        "postal_code": "W13 3BG",
                        "city": "London",
                        "phone": "01895808221",
                        "country": "GB"
                    },
                    "customer": {
                        "date_of_birth": "1970-01-01",
                        "gender": "male"
                    },
                    "products": [
                        {
                            "name": "Battery Power Pack",
                            "quantity": 1,
                            "unit_price": 1000,
                            "tax_rate": 0,
                            "total_amount": 1000,
                            "total_tax_amount": 0
                        }
                    ]
                }),
                currency: "GBP",
                amount: 1005,
            });
        } catch (err) {
            expect(err.name).to.equal('API Error');
        }
    });

    it("should throw AuthenticationError", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(401);
        const http = new Http();

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
            let transaction = await pay.request<KlarnaSource>({
                source: new KlarnaSource({
                    "authorization_token": "b4bd3423-24e3",
                    "locale": "en-GB",
                    "purchase_country": "GB",
                    "tax_amount": 0,
                    "billing_address": {
                        "given_name": "John",
                        "family_name": "Doe",
                        "email": "johndoe@email.com",
                        "title": "Mr",
                        "street_address": "13 New Burlington St",
                        "street_address2": "Apt 214",
                        "postal_code": "W13 3BG",
                        "city": "London",
                        "phone": "01895808221",
                        "country": "GB"
                    },
                    "customer": {
                        "date_of_birth": "1970-01-01",
                        "gender": "male"
                    },
                    "products": [
                        {
                            "name": "Battery Power Pack",
                            "quantity": 1,
                            "unit_price": 1000,
                            "tax_rate": 0,
                            "total_amount": 1000,
                            "total_tax_amount": 0
                        }
                    ]
                }),
                currency: "GBP",
                amount: 1005,
            });
        } catch (err) {
            expect(err.name).to.equal('AuthenticationError');
        }
    });

    it("should throw ValidationError", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(422, {
                "request_id": "0HL80RJLS76I7",
                "error_type": "request_invalid",
                "error_codes": [
                    "payment_source_required"
                ]
            });
        const http = new Http();
        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
            let transaction = await pay.request<KlarnaSource>({
                source: new KlarnaSource({
                    "authorization_token": "b4bd3423-24e3",
                    "locale": "en-GB",
                    "purchase_country": "GB",
                    "tax_amount": 0,
                    "billing_address": {
                        "given_name": "John",
                        "family_name": "Doe",
                        "email": "johndoe@email.com",
                        "title": "Mr",
                        "street_address": "13 New Burlington St",
                        "street_address2": "Apt 214",
                        "postal_code": "W13 3BG",
                        "city": "London",
                        "phone": "01895808221",
                        "country": "GB"
                    },
                    "customer": {
                        "date_of_birth": "1970-01-01",
                        "gender": "male"
                    },
                    "products": [
                        {
                            "name": "Battery Power Pack",
                            "quantity": 1,
                            "unit_price": 1000,
                            "tax_rate": 0,
                            "total_amount": 1000,
                            "total_tax_amount": 0
                        }
                    ]
                }),
                currency: "GBP",
                amount: 1005,
            });
        } catch (err) {
            expect(err).to.be.instanceOf(ValidationError)
        }
    });

    it("should throw TooManyRequestsError", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(429, {
                "request_id": "0HL80RJLS76I7",
                "error_type": "request_invalid",
                "error_codes": [
                    "payment_source_required"
                ]
            });
        const http = new Http();

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
            let transaction = await pay.request<KlarnaSource>({
                source: new KlarnaSource({
                    "authorization_token": "b4bd3423-24e3",
                    "locale": "en-GB",
                    "purchase_country": "GB",
                    "tax_amount": 0,
                    "billing_address": {
                        "given_name": "John",
                        "family_name": "Doe",
                        "email": "johndoe@email.com",
                        "title": "Mr",
                        "street_address": "13 New Burlington St",
                        "street_address2": "Apt 214",
                        "postal_code": "W13 3BG",
                        "city": "London",
                        "phone": "01895808221",
                        "country": "GB"
                    },
                    "customer": {
                        "date_of_birth": "1970-01-01",
                        "gender": "male"
                    },
                    "products": [
                        {
                            "name": "Battery Power Pack",
                            "quantity": 1,
                            "unit_price": 1000,
                            "tax_rate": 0,
                            "total_amount": 1000,
                            "total_tax_amount": 0
                        }
                    ]
                }),
                currency: "GBP",
                amount: 1005,
            });
        } catch (err) {
            expect(err).to.be.instanceOf(TooManyRequestsError)
        }
    });

    it("should throw BadGateway", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(502);
        const http = new Http();

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
            let transaction = await pay.request<KlarnaSource>({
                source: new KlarnaSource({
                    "authorization_token": "b4bd3423-24e3",
                    "locale": "en-GB",
                    "purchase_country": "GB",
                    "tax_amount": 0,
                    "billing_address": {
                        "given_name": "John",
                        "family_name": "Doe",
                        "email": "johndoe@email.com",
                        "title": "Mr",
                        "street_address": "13 New Burlington St",
                        "street_address2": "Apt 214",
                        "postal_code": "W13 3BG",
                        "city": "London",
                        "phone": "01895808221",
                        "country": "GB"
                    },
                    "customer": {
                        "date_of_birth": "1970-01-01",
                        "gender": "male"
                    },
                    "products": [
                        {
                            "name": "Battery Power Pack",
                            "quantity": 1,
                            "unit_price": 1000,
                            "tax_rate": 0,
                            "total_amount": 1000,
                            "total_tax_amount": 0
                        }
                    ]
                }),
                currency: "GBP",
                amount: 1005,
            });
        } catch (err) {
            expect(err).to.be.instanceOf(BadGateway)
        }
    });
});

describe("Request Payment with Knet Source", async () => {

    it("should perform normal payment request with a Knet Source", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(202, {
                "id": "pay_vbyf6f4kd7ee5oj2ittsljetwa",
                "status": "Pending",
                "customer": {
                    "id": "cus_qo2kuoc3jwhu3f36tuajddvlue"
                },
                "_links": {
                    "self": {
                        "href": "https://api.sandbox.checkout.com/payments/pay_vbyf6f4kd7ee5oj2ittsljetwa"
                    },
                    "redirect": {
                        "href": "https://sbapi.ckotech.co/knet-external/redirect/tok_w6cfo43agmde7kc3tyvteqfc5m/pay"
                    }
                }
            });

        const pay = new payments('sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f808');

        let transaction = await pay.request<KnetSource>({
            source: new KnetSource({
                "language": "en",
                "user_defined_field1": "first user defined field",
                "user_defined_field2": "second user defined field",
                "card_token": "01234567",
                "user_defined_field4": "fourth user defined field",
                "ptlf": "96033587c7b5"
            }),
            currency: "KWD",
            amount: 100
        });

        expect(transaction.status).to.equal("Pending");
        expect(transaction.requiresRedirect()).to.be.true;
    });



    it("should timeout payment request with a Kner Source", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .delay(20)
            .reply(201, {});

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
            pay.httpConfiguration = {
                timeout: 10,
                environment: Environment.Sandbox
            }
            let transaction = await pay.request<KnetSource>({
                source: new KnetSource({
                    "language": "en",
                    "user_defined_field1": "first user defined field",
                    "user_defined_field2": "second user defined field",
                    "card_token": "01234567",
                    "user_defined_field4": "fourth user defined field",
                    "ptlf": "96033587c7b5"
                }),
                currency: "KWD",
                amount: 1005,
            });
        } catch (err) {
            expect(err.name).to.equal('ApiTimeout');
        }
    });

    it("should error out with API Error for payment request with a Knet Source", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(500, {
                error: 'error'
            });

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
            let transaction = await pay.request<KnetSource>({
                source: new KnetSource({
                    "language": "en",
                    "user_defined_field1": "first user defined field",
                    "user_defined_field2": "second user defined field",
                    "card_token": "01234567",
                    "user_defined_field4": "fourth user defined field",
                    "ptlf": "96033587c7b5"
                }),
                currency: "KWD",
                amount: 1005,
            });
        } catch (err) {
            expect(err.name).to.equal('API Error');
        }
    });

    it("should throw AuthenticationError", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(401);
        const http = new Http();

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
            let transaction = await pay.request<KnetSource>({
                source: new KnetSource({
                    "language": "en",
                    "user_defined_field1": "first user defined field",
                    "user_defined_field2": "second user defined field",
                    "card_token": "01234567",
                    "user_defined_field4": "fourth user defined field",
                    "ptlf": "96033587c7b5"
                }),
                currency: "KWD",
                amount: 1005,
            });
        } catch (err) {
            expect(err.name).to.equal('AuthenticationError');
        }
    });

    it("should throw ValidationError", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(422, {
                "request_id": "0HL80RJLS76I7",
                "error_type": "request_invalid",
                "error_codes": [
                    "payment_source_required"
                ]
            });
        const http = new Http();
        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
            let transaction = await pay.request<KnetSource>({
                source: new KnetSource({
                    "language": "en",
                    "user_defined_field1": "first user defined field",
                    "user_defined_field2": "second user defined field",
                    "card_token": "01234567",
                    "user_defined_field4": "fourth user defined field",
                    "ptlf": "96033587c7b5"
                }),
                currency: "KWD",
                amount: 1005,
            });
        } catch (err) {
            expect(err).to.be.instanceOf(ValidationError)
        }
    });

    it("should throw TooManyRequestsError", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(429, {
                "request_id": "0HL80RJLS76I7",
                "error_type": "request_invalid",
                "error_codes": [
                    "payment_source_required"
                ]
            });
        const http = new Http();

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
            let transaction = await pay.request<KnetSource>({
                source: new KnetSource({
                    "language": "en",
                    "user_defined_field1": "first user defined field",
                    "user_defined_field2": "second user defined field",
                    "card_token": "01234567",
                    "user_defined_field4": "fourth user defined field",
                    "ptlf": "96033587c7b5"
                }),
                currency: "KWD",
                amount: 1005,
            });
        } catch (err) {
            expect(err).to.be.instanceOf(TooManyRequestsError)
        }
    });

    it("should throw BadGateway", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(502);
        const http = new Http();

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
            let transaction = await pay.request<KnetSource>({
                source: new KnetSource({
                    "language": "en",
                    "user_defined_field1": "first user defined field",
                    "user_defined_field2": "second user defined field",
                    "card_token": "01234567",
                    "user_defined_field4": "fourth user defined field",
                    "ptlf": "96033587c7b5"
                }),
                currency: "KWD",
                amount: 1005,
            });
        } catch (err) {
            expect(err).to.be.instanceOf(BadGateway)
        }
    });
});

describe("Request Payment with Poli Source", async () => {

    it("should perform normal payment request with a Poli Source", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(202, {
                "id": "pay_xjndyxg5hm6ujfyxhn4ctdwnv4",
                "status": "Pending",
                "customer": {
                    "id": "cus_6fb5ub5rlsiehg66tbtbp64auq"
                },
                "_links": {
                    "self": {
                        "href": "https://api.sandbox.checkout.com/payments/pay_xjndyxg5hm6ujfyxhn4ctdwnv4"
                    },
                    "approve": {
                        "href": "https://api.sandbox.checkout.com/fawry/payments/1192437644/approval"
                    },
                    "cancel": {
                        "href": "https://api.sandbox.checkout.com/fawry/payments/1192437644/cancellation"
                    }
                }
            });

        const pay = new payments('sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f808');

        let transaction = await pay.request<PoliSource>({
            source: new PoliSource(),
            currency: "AUD",
            amount: 100
        });

        expect(transaction.status).to.equal("Pending");
        expect(transaction.requiresRedirect()).to.be.true;
    });



    it("should timeout payment request with a Kner Source", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .delay(20)
            .reply(201, {});

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
            pay.httpConfiguration = {
                timeout: 10,
                environment: Environment.Sandbox
            }
            let transaction = await pay.request<PoliSource>({
                source: new PoliSource(),
                currency: "AUD",
                amount: 1005,
            });
        } catch (err) {
            expect(err.name).to.equal('ApiTimeout');
        }
    });

    it("should error out with API Error for payment request with a Poli Source", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(500, {
                error: 'error'
            });

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
            let transaction = await pay.request<PoliSource>({
                source: new PoliSource(),
                currency: "AUD",
                amount: 1005,
            });
        } catch (err) {
            expect(err.name).to.equal('API Error');
        }
    });

    it("should throw AuthenticationError", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(401);
        const http = new Http();

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
            let transaction = await pay.request<PoliSource>({
                source: new PoliSource(),
                currency: "AUD",
                amount: 1005,
            });
        } catch (err) {
            expect(err.name).to.equal('AuthenticationError');
        }
    });

    it("should throw ValidationError", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(422, {
                "request_id": "0HL80RJLS76I7",
                "error_type": "request_invalid",
                "error_codes": [
                    "payment_source_required"
                ]
            });
        const http = new Http();
        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
            let transaction = await pay.request<PoliSource>({
                source: new PoliSource(),
                currency: "AUD",
                amount: 1005,
            });
        } catch (err) {
            expect(err).to.be.instanceOf(ValidationError)
        }
    });

    it("should throw TooManyRequestsError", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(429, {
                "request_id": "0HL80RJLS76I7",
                "error_type": "request_invalid",
                "error_codes": [
                    "payment_source_required"
                ]
            });
        const http = new Http();

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
            let transaction = await pay.request<PoliSource>({
                source: new PoliSource(),
                currency: "AUD",
                amount: 1005,
            });
        } catch (err) {
            expect(err).to.be.instanceOf(TooManyRequestsError)
        }
    });

    it("should throw BadGateway", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(502);
        const http = new Http();

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
            let transaction = await pay.request<PoliSource>({
                source: new PoliSource(),
                currency: "AUD",
                amount: 1005,
            });
        } catch (err) {
            expect(err).to.be.instanceOf(BadGateway)
        }
    });
});

describe("Request Payment with Qpay Source", async () => {

    it("should perform normal payment request with a Qpay Source", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(202, {
                "id": "pay_xjndyxg5hm6ujfyxhn4ctdwnv4",
                "status": "Pending",
                "customer": {
                    "id": "cus_6fb5ub5rlsiehg66tbtbp64auq"
                },
                "_links": {
                    "self": {
                        "href": "https://api.sandbox.checkout.com/payments/pay_xjndyxg5hm6ujfyxhn4ctdwnv4"
                    },
                    "approve": {
                        "href": "https://api.sandbox.checkout.com/fawry/payments/1192437644/approval"
                    },
                    "cancel": {
                        "href": "https://api.sandbox.checkout.com/fawry/payments/1192437644/cancellation"
                    }
                }
            });

        const pay = new payments('sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f808');

        let transaction = await pay.request<QpaySource>({
            source: new QpaySource({
                "description": "QPay Demo Payment",
                "language": "en",
                "quantity": 1,
                "national_id": "070AYY010BU234M"
            }),
            currency: "QAR",
            amount: 100
        });

        expect(transaction.status).to.equal("Pending");
        expect(transaction.requiresRedirect()).to.be.true;
    });



    it("should timeout payment request with a Qpay Source", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .delay(20)
            .reply(201, {});

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
            pay.httpConfiguration = {
                timeout: 10,
                environment: Environment.Sandbox
            }
            let transaction = await pay.request<QpaySource>({
                source: new QpaySource({
                    "description": "QPay Demo Payment",
                    "language": "en",
                    "quantity": 1,
                    "national_id": "070AYY010BU234M"
                }),
                currency: "QAR",
                amount: 1005,
            });
        } catch (err) {
            expect(err.name).to.equal('ApiTimeout');
        }
    });

    it("should error out with API Error for payment request with a Qpay Source", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(500, {
                error: 'error'
            });

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
            let transaction = await pay.request<QpaySource>({
                source: new QpaySource({
                    "description": "QPay Demo Payment",
                    "language": "en",
                    "quantity": 1,
                    "national_id": "070AYY010BU234M"
                }),
                currency: "QAR",
                amount: 1005,
            });
        } catch (err) {
            expect(err.name).to.equal('API Error');
        }
    });

    it("should throw AuthenticationError", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(401);
        const http = new Http();

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
            let transaction = await pay.request<QpaySource>({
                source: new QpaySource({
                    "description": "QPay Demo Payment",
                    "language": "en",
                    "quantity": 1,
                    "national_id": "070AYY010BU234M"
                }),
                currency: "QAR",
                amount: 1005,
            });
        } catch (err) {
            expect(err.name).to.equal('AuthenticationError');
        }
    });

    it("should throw ValidationError", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(422, {
                "request_id": "0HL80RJLS76I7",
                "error_type": "request_invalid",
                "error_codes": [
                    "payment_source_required"
                ]
            });
        const http = new Http();
        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
            let transaction = await pay.request<QpaySource>({
                source: new QpaySource({
                    "description": "QPay Demo Payment",
                    "language": "en",
                    "quantity": 1,
                    "national_id": "070AYY010BU234M"
                }),
                currency: "QAR",
                amount: 1005,
            });
        } catch (err) {
            expect(err).to.be.instanceOf(ValidationError)
        }
    });

    it("should throw TooManyRequestsError", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(429, {
                "request_id": "0HL80RJLS76I7",
                "error_type": "request_invalid",
                "error_codes": [
                    "payment_source_required"
                ]
            });
        const http = new Http();

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
            let transaction = await pay.request<QpaySource>({
                source: new QpaySource({
                    "description": "QPay Demo Payment",
                    "language": "en",
                    "quantity": 1,
                    "national_id": "070AYY010BU234M"
                }),
                currency: "QAR",
                amount: 1005,
            });
        } catch (err) {
            expect(err).to.be.instanceOf(TooManyRequestsError)
        }
    });

    it("should throw BadGateway", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(502);
        const http = new Http();

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
            let transaction = await pay.request<QpaySource>({
                source: new QpaySource({
                    "description": "QPay Demo Payment",
                    "language": "en",
                    "quantity": 1,
                    "national_id": "070AYY010BU234M"
                }),
                currency: "QAR",
                amount: 1005,
            });
        } catch (err) {
            expect(err).to.be.instanceOf(BadGateway)
        }
    });
});

describe("Request Payment with Sofort Source", async () => {

    it("should perform normal payment request with a Sofort Source", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(202, {
                "id": "pay_xjndyxg5hm6ujfyxhn4ctdwnv4",
                "status": "Pending",
                "customer": {
                    "id": "cus_6fb5ub5rlsiehg66tbtbp64auq"
                },
                "_links": {
                    "self": {
                        "href": "https://api.sandbox.checkout.com/payments/pay_xjndyxg5hm6ujfyxhn4ctdwnv4"
                    },
                    "approve": {
                        "href": "https://api.sandbox.checkout.com/fawry/payments/1192437644/approval"
                    },
                    "cancel": {
                        "href": "https://api.sandbox.checkout.com/fawry/payments/1192437644/cancellation"
                    }
                }
            });

        const pay = new payments('sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f808');

        let transaction = await pay.request<SofortSource>({
            source: new SofortSource(),
            currency: "EUR",
            amount: 100
        });

        expect(transaction.status).to.equal("Pending");
        expect(transaction.requiresRedirect()).to.be.true;
    });



    it("should timeout payment request with a Sofort Source", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .delay(20)
            .reply(201, {});

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
            pay.httpConfiguration = {
                timeout: 10,
                environment: Environment.Sandbox
            }
            let transaction = await pay.request<SofortSource>({
                source: new SofortSource(),
                currency: "EUR",
                amount: 1005,
            });
        } catch (err) {
            expect(err.name).to.equal('ApiTimeout');
        }
    });

    it("should error out with API Error for payment request with a Sofort Source", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(500, {
                error: 'error'
            });

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
            let transaction = await pay.request<SofortSource>({
                source: new SofortSource(),
                currency: "EUR",
                amount: 1005,
            });
        } catch (err) {
            expect(err.name).to.equal('API Error');
        }
    });

    it("should throw AuthenticationError", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(401);
        const http = new Http();

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
            let transaction = await pay.request<SofortSource>({
                source: new SofortSource(),
                currency: "EUR",
                amount: 1005,
            });
        } catch (err) {
            expect(err.name).to.equal('AuthenticationError');
        }
    });

    it("should throw ValidationError", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(422, {
                "request_id": "0HL80RJLS76I7",
                "error_type": "request_invalid",
                "error_codes": [
                    "payment_source_required"
                ]
            });
        const http = new Http();
        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
            let transaction = await pay.request<SofortSource>({
                source: new SofortSource(),
                currency: "EUR",
                amount: 1005,
            });
        } catch (err) {
            expect(err).to.be.instanceOf(ValidationError)
        }
    });

    it("should throw TooManyRequestsError", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(429, {
                "request_id": "0HL80RJLS76I7",
                "error_type": "request_invalid",
                "error_codes": [
                    "payment_source_required"
                ]
            });
        const http = new Http();

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
            let transaction = await pay.request<SofortSource>({
                source: new SofortSource(),
                currency: "EUR",
                amount: 1005,
            });
        } catch (err) {
            expect(err).to.be.instanceOf(TooManyRequestsError)
        }
    });

    it("should throw BadGateway", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(502);
        const http = new Http();

        try {
            const pay = new payments('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
            let transaction = await pay.request<SofortSource>({
                source: new SofortSource(),
                currency: "EUR",
                amount: 1005,
            });
        } catch (err) {
            expect(err).to.be.instanceOf(BadGateway)
        }
    });
});

describe("Payout with a card source", async () => {
    it("should perform a payout request with a Card Source", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(201, {
                "id": "pay_dd4wf2r5ebg4tp6hcsps6vvacu",
                "action_id": "act_dd4wf2r5ebg4tp6hcsps6vvacu",
                "amount": 100,
                "currency": "USD",
                "approved": true,
                "status": "Paid",
                "auth_code": "928892",
                "response_code": "10000",
                "response_summary": "Approved",
                "destination": {
                    "id": "src_bvlx3x7f4xhedntgjeznclkzzq",
                    "type": "card",
                    "expiry_month": 6,
                    "expiry_year": 2029,
                    "name": "Maga Test",
                    "scheme": "Visa",
                    "last4": "4242",
                    "fingerprint": "107A352DFAE35E3EEBA5D0856FCDFB88ECF91E8CFDE4275ABBC791FD9579AB2C",
                    "bin": "424242",
                    "card_type": "Credit",
                    "card_category": "Consumer",
                    "issuer": "JPMORGAN CHASE BANK NA",
                    "issuer_country": "US",
                    "product_id": "A",
                    "product_type": "Visa Traditional"
                },
                "customer": {
                    "id": "cus_35vhrjee2csu7j7gz2yxwmbvpe"
                },
                "processed_on": "2019-07-29T16:49:43Z",
                "reference": "Test",
                "_links": {
                    "self": {
                        "href": "https://api.sandbox.checkout.com/payments/pay_dd4wf2r5ebg4tp6hcsps6vvacu"
                    },
                    "actions": {
                        "href": "https://api.sandbox.checkout.com/payments/pay_dd4wf2r5ebg4tp6hcsps6vvacu/actions"
                    }
                }
            });

        const pay = new payments('sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f808');

        let transaction = await pay.request<CardSource, CardDestination>({
            destination: new CardDestination({
                number: "4242424242424242",
                expiry_month: 6,
                expiry_year: 2029,
                first_name: "Maga",
                last_name: "Test"
            }),
            currency: "USD",
            amount: 100,
            reference: "Test"
        });

        if (transaction.destination !== undefined) {
            expect(transaction.destination.last4).to.equal("4242");
            expect(transaction.destination.scheme).to.equal("Visa");
            expect(transaction.status).to.equal("Paid");
        }
    });

    it("should perform a payout request with a Token Source", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(201, {
                "id": "pay_acxn4pejxmcmpa5bbxnpwxwhbq",
                "action_id": "act_acxn4pejxmcmpa5bbxnpwxwhbq",
                "amount": 100,
                "currency": "USD",
                "approved": true,
                "status": "Paid",
                "auth_code": "739520",
                "response_code": "10000",
                "response_summary": "Approved",
                "destination": {
                    "id": "src_2wmut3rtrmfu5mpz3nyb2qqim4",
                    "type": "card",
                    "expiry_month": 6,
                    "expiry_year": 2028,
                    "scheme": "Visa",
                    "last4": "4242",
                    "fingerprint": "35D40AFFDC82BCAC9890181E14655B05D8924C0B4986D29F99D13946A3B59513",
                    "bin": "424242",
                    "card_type": "Credit",
                    "card_category": "Consumer",
                    "issuer": "JPMORGAN CHASE BANK NA",
                    "issuer_country": "US",
                    "product_id": "A",
                    "product_type": "Visa Traditional"
                },
                "customer": {
                    "id": "cus_hq4vyreifheurpuw3h2vcboo44"
                },
                "processed_on": "2019-07-29T20:47:45Z",
                "reference": "Test",
                "_links": {
                    "self": {
                        "href": "https://api.sandbox.checkout.com/payments/pay_acxn4pejxmcmpa5bbxnpwxwhbq"
                    },
                    "actions": {
                        "href": "https://api.sandbox.checkout.com/payments/pay_acxn4pejxmcmpa5bbxnpwxwhbq/actions"
                    }
                }
            });

        const pay = new payments('sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f808');

        let transaction = await pay.request<CardSource, TokenDestination>({
            destination: new TokenDestination({
                token: "tok_44ig6aegqexujdd7mbcumfwica",
                first_name: "Maga",
                last_name: "Test"
            }),
            currency: "USD",
            amount: 100,
            reference: "Test"
        });

        if (transaction.destination !== undefined) {
            expect(transaction.destination.last4).to.equal("4242");
            expect(transaction.destination.scheme).to.equal("Visa");
            expect(transaction.status).to.equal("Paid");
        }
    });

    it("should perform a payout request with a Id Source", async () => {
        nock("https://api.sandbox.checkout.com")
            .post("/payments")
            .reply(201, {
                "id": "pay_xmeb5uklnwf4bpnifxloibouze",
                "action_id": "act_xmeb5uklnwf4bpnifxloibouze",
                "amount": 100,
                "currency": "USD",
                "approved": true,
                "status": "Paid",
                "auth_code": "114312",
                "response_code": "10000",
                "response_summary": "Approved",
                "destination": {
                    "id": "src_6eyexdb5hjiengub4pon76nwli",
                    "type": "card",
                    "phone": {
                        "country_code": "1",
                        "number": "415 555 2671"
                    },
                    "expiry_month": 8,
                    "expiry_year": 2025,
                    "name": "Maga Test",
                    "scheme": "Visa",
                    "last4": "4242",
                    "fingerprint": "5CD3B9CB15338683110959D165562D23084E1FF564F420FE9A990DF0BCD093FC",
                    "bin": "424242",
                    "card_type": "Credit",
                    "card_category": "Consumer",
                    "issuer": "JPMORGAN CHASE BANK NA",
                    "issuer_country": "US",
                    "product_id": "A",
                    "product_type": "Visa Traditional"
                },
                "customer": {
                    "id": "cus_x3saioiw7dherjo5yusoly5yri",
                    "name": "Maga Test"
                },
                "processed_on": "2019-07-29T20:50:10Z",
                "reference": "Test",
                "_links": {
                    "self": {
                        "href": "https://api.sandbox.checkout.com/payments/pay_xmeb5uklnwf4bpnifxloibouze"
                    },
                    "actions": {
                        "href": "https://api.sandbox.checkout.com/payments/pay_xmeb5uklnwf4bpnifxloibouze/actions"
                    }
                }
            });

        const pay = new payments('sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f808');

        let transaction = await pay.request<CardSource, IdDestination>({
            destination: new IdDestination({
                id: "src_6eyexdb5hjiengub4pon76nwli",
                first_name: "Maga",
                last_name: "Test"
            }),
            currency: "USD",
            amount: 100,
            reference: "Test"
        });

        if (transaction.destination !== undefined) {
            expect(transaction.destination.last4).to.equal("4242");
            expect(transaction.destination.scheme).to.equal("Visa");
            expect(transaction.status).to.equal("Paid");
        }
    });
});