/* tslint:disable:no-unused-variable */

// const { checkout } = require('../lib/index');

const nock = require("nock");
import { expect } from 'chai'
import {
    Http,
} from "../src/common/http";
import { Configuration } from "../src/configuration";

describe("Http Client", async () => {
    it("should set the HTTP configuration", async () => {
        const http = new Http(
            new Configuration({
                retries: 5,
                timeout: 5000
            })
        );
        const config = http.getConfiguration();
        expect(config.retries).to.equal(5);
        expect(config.timeout).to.equal(5000);
    });

    it("should default if not http config is provided", async () => {
        const http = new Http();
        const config = http.getConfiguration();
        expect(config.retries).to.equal(0);
        expect(config.timeout).to.equal(5000);
    });

    it("should default if not http config is provided", async () => {
        const http = new Http();
        const config = http.getConfiguration();
        expect(config.retries).to.equal(0);
        expect(config.timeout).to.equal(5000);
    });

    it("should do POST using body, headers and to url", async () => {
        nock("https://mock.com")
            .post("/test")
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
        const outcome = await http.post(
            {
                url: 'https://mock.com/test',
                key: 'sk_test_43ed9a7f-4799-461d-b201-a70507878b51',
                body: {
                    payload: 'test'
                }
            }
        )

        const json = await outcome.json;
        expect(json.headers.host).to.equal('mock.com');
        expect(json.path).to.equal('/test');
        expect(json.headers.authorization[0]).to.equal('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
        expect(json.requestBody).to.eql({ payload: 'test' });
    });

    it("should do GET using headers and to url", async () => {
        nock("https://mock.com")
            .get("/test")
            // @ts-ignore
            .reply(function (uri) {
                return {
                    uri,
                    // @ts-ignore
                    headers: this.req.headers,
                    // @ts-ignore
                    path: this.req.path
                }
            })
        const http = new Http();
        const outcome = await http.get(
            {
                url: 'https://mock.com/test',
                key: 'sk_test_43ed9a7f-4799-461d-b201-a70507878b51',
            }
        )

        const json = await outcome.json;
        expect(json.headers.host).to.equal('mock.com');
        expect(json.path).to.equal('/test');
        expect(json.headers.authorization[0]).to.equal('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
    });
});