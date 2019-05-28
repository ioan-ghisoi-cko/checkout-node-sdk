/* tslint:disable:no-unused-variable */

// const { checkout } = require('../lib/index');

const nock = require("nock");
import { expect } from 'chai'
import {
    Http,
} from "../src/common/http";
import { HttpConfiguration } from "../src/configuration";
import { Environment } from "../src/index";

describe("Http Client", async () => {
    it("should create http client with a defined configuration", async () => {
        const cnf = new HttpConfiguration({
            timeout: 5000
        })
        const http = new Http(cnf);
        expect(http).to.be.instanceOf(Http);
        expect(http.configuration.timeout).to.equal(5000);
    });

    it("should be able to get/set http client configuration", async () => {
        const cnf = new HttpConfiguration({
            timeout: 5000
        });
        const http = new Http(cnf);
        expect(http.configuration).to.equal(cnf);
        const cnf2 = new HttpConfiguration({
            timeout: 5000
        });
        http.configuration = cnf2;
        expect(http.configuration).to.equal(cnf2);
    });

    it("should be able POST body and auth header", async () => {
        nock("https://api.sandbox.checkout.com")
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
        const cnf = new HttpConfiguration({
            environment: Environment.Sandbox,
            timeout: 5000
        });
        const http = new Http(cnf);
        const outcome = await http.send(
            {
                method: 'post',
                path: '/payments',
                authorization: 'sk_test_43ed9a7f-4799-461d-b201-a70507878b51',
            }
        )
        const json = await outcome.json;
        expect(json.headers.host).to.equal('api.sandbox.checkout.com');
        expect(json.path).to.equal('/payments');
        expect(json.headers.authorization[0]).to.equal('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
    });

    it("should throw error for POST", async () => {
        nock('https://api.sandbox.checkout.com')
            .post("/payments")
            .replyWithError({
                message: 'something awful happened',
                code: 'AWFUL_ERROR',
            });
        const cnf = new HttpConfiguration({
            timeout: 5000
        });
        const http = new Http(cnf);
        try {
            const outcome = await http.send(
                {
                    method: 'post',
                    path: '/payments',
                    authorization: 'sk_test_43ed9a7f-4799-461d-b201-a70507878b51',
                    body: {
                        payload: 'test'
                    }
                }
            )
            const json = await outcome.json;
        } catch (err) {
            expect(err.code).to.equal('AWFUL_ERROR');
        }
    });

    it("should throw invalid configuration error for POST", async () => {
        const cnf = new HttpConfiguration({
            timeout: 5000
        });
        const http = new Http(cnf);
        // @ts-ignore
        http.configuration = undefined;
        try {
            const outcome = await http.send(
                {
                    method: 'post',
                    path: '/payments',
                    authorization: 'sk_test_43ed9a7f-4799-461d-b201-a70507878b51',
                    body: {
                        payload: 'test'
                    }
                }
            )
            const json = await outcome.json;
        } catch (err) {
            expect(err.name).to.equal('ValueError');
        }
    });

    it("should be able GET with auth header", async () => {
        nock("https://api.sandbox.checkout.com")
            .get("/payment")
            // @ts-ignore
            .reply(function (uri, requestBody) {
                return {
                    uri,
                    // @ts-ignore
                    headers: this.req.headers,
                    // @ts-ignore
                    path: this.req.path
                }
            })
        const cnf = new HttpConfiguration({
            timeout: 5000
        });
        const http = new Http(cnf);
        const outcome = await http.send(
            {
                method: 'get',
                path: '/payment',
                authorization: 'sk_test_43ed9a7f-4799-461d-b201-a70507878b51'
            }
        )
        const json = await outcome.json;
        expect(json.headers.host).to.equal('api.sandbox.checkout.com');
        expect(json.path).to.equal('/payment');
        expect(json.headers.authorization[0]).to.equal('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
    });

    it("should throw invalid configuration error for GET", async () => {
        const cnf = new HttpConfiguration({
            timeout: 5000
        });
        const http = new Http(cnf);
        // @ts-ignore
        http.configuration = undefined;
        try {
            const outcome = await http.send(
                {
                    method: 'get',
                    path: '/payment',
                    authorization: 'sk_test_43ed9a7f-4799-461d-b201-a70507878b51'
                }
            )
            const json = await outcome.json;
        } catch (err) {
            expect(err.name).to.equal('ValueError');
        }
    });

    it("should throw error for GET", async () => {
        nock('https://api.sandbox.checkout.com')
            .get("/payment")
            .replyWithError({
                message: 'something awful happened',
                code: 'AWFUL_ERROR',
            });
        const cnf = new HttpConfiguration({
            timeout: 5000
        });
        const http = new Http(cnf);
        try {
            const outcome = await http.send(
                {
                    method: 'get',
                    path: '/payment',
                    authorization: 'sk_test_43ed9a7f-4799-461d-b201-a70507878b51'
                }
            )
            const json = await outcome.json;
        } catch (err) {
            expect(err.code).to.equal('AWFUL_ERROR');
        }
    });
});