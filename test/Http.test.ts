import { expect } from 'chai'
import { Http, Environment } from '../src';
const nock = require("nock");

describe("Http", async () => {
    it("should create http client with a default HTTP configuration", async () => {
        const http = new Http();
        expect(http).to.be.instanceOf(Http);
        expect(http.configuration.timeout).to.equal(5000);
    });

    it("should set the http client configuration in the constructor", async () => {
        const http = new Http({
            timeout: 3000,
            environment: Environment.Sandbox
        });
        expect(http.configuration.timeout).to.equal(3000);
    });

    it("should set the http client configuration via parameter", async () => {
        const http = new Http();

        http.configuration = {
            timeout: 3000,
            environment: Environment.Sandbox
        };
        expect(http.configuration.timeout).to.equal(3000);
    });

    it("should get the http client configuration", async () => {
        const http = new Http({
            timeout: 3000,
            environment: Environment.Sandbox
        });

        expect(http.configuration).to.eql({ timeout: 3000, environment: "https://api.sandbox.checkout.com" });
    });

    it("should perform POST request with body and auth header", async () => {

        nock("https://test.com")
            .post("/payments")
            // @ts-ignore
            .reply(function (uri, requestBody) {
                return {
                    uri,
                    requestBody,
                    // @ts-ignore
                    headers: this.req.headers,
                    // @ts-ignore
                    path: this.req.path
                }
            })
        const http = new Http();
        const outcome = await http.send(
            {
                method: 'post',
                url: 'https://test.com/payments',
                headers: {
                    Authorization: 'sk_test_43ed9a7f-4799-461d-b201-a70507878b51'
                },
                body: {
                    test: true
                }
            }
        )
        const json = await outcome.json;
        expect(json.headers.host).to.equal('test.com');
        expect(json.path).to.equal('/payments');
        expect(json.headers.authorization[0]).to.equal('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
        expect(json.requestBody).to.eql({ test: true });
    });

    it("should perform GET request with auth header", async () => {

        nock("https://test.com")
            .get("/payments")
            // @ts-ignore
            .reply(function (uri) {
                return {
                    uri,
                    requestBody: {
                        success: true
                    },
                    // @ts-ignore
                    headers: this.req.headers,
                    // @ts-ignore
                    path: this.req.path
                }
            })
        const http = new Http();
        const outcome = await http.send(
            {
                method: 'get',
                url: 'https://test.com/payments',
                headers: {
                    Authorization: 'sk_test_43ed9a7f-4799-461d-b201-a70507878b51'
                },
            }
        )
        const json = await outcome.json;
        expect(json.headers.host).to.equal('test.com');
        expect(json.path).to.equal('/payments');
        expect(json.headers.authorization[0]).to.equal('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
        expect(json.requestBody).to.eql({ success: true });
    });

    it("should throw error for POST", async () => {
        nock('https://test.com')
            .post("/payments")
            .replyWithError({
                message: 'something awful happened',
                code: 'AWFUL_ERROR',
            });
        const http = new Http();
        try {
            const outcome = await http.send(
                {
                    method: 'post',
                    url: 'https://test.com/payments',
                    headers: {
                        Authorization: 'sk_test_43ed9a7f-4799-461d-b201-a70507878b51'
                    },
                    body: {
                        payload: 'test'
                    }
                }
            )
            const json = await outcome.json;
        } catch (err) {
            expect(err.message.split(': ').pop()).to.equal('something awful happened');
        }
    });

    it("should replace empty null body with empty body", async () => {
        nock('https://test.com')
            .get("/payments")
            .reply(200);
        const http = new Http();

        const outcome = await http.send(
            {
                method: 'get',
                url: 'https://test.com/payments',
                headers: {
                    Authorization: 'sk_test_43ed9a7f-4799-461d-b201-a70507878b51'
                },
            }
        )
        const json = await outcome.json;
        expect(json).to.eql({});
    });

    it("should send idempotency key in the header", async () => {

        nock("https://test.com")
            .post("/payments")
            // @ts-ignore
            .reply(function () {
                return {
                    // @ts-ignore
                    headers: this.req.headers,
                }
            })
        const http = new Http();
        const outcome = await http.send(
            {
                method: 'post',
                url: 'https://test.com/payments',
                headers: {
                    Authorization: 'sk_test_43ed9a7f-4799-461d-b201-a70507878b51',
                    'Cko-Idempotency-Key': '123'
                },
                body: {}
            }
        )
        const json = await outcome.json;
        expect(json.headers['cko-idempotency-key']).to.eql(['123']);
    });
});