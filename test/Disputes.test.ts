import { expect } from 'chai'
import { Environment, CardSource, ApplePaySource, GooglePaySource, NoWebhooksConfigured } from '../src';
import {
	AuthenticationError,
	ValidationError,
	NotFoundError,
	UnprocessableError,
	TooManyRequestsError
} from '../src/models/response/HttpErrors';
import disputes from '../src/api/Disputes';
const nock = require("nock");

describe("Disputes", async () => {
	it("should create instance of Dispute class with a HTTP configuration", async () => {
		const dsp = new disputes('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
		expect(dsp).to.be.instanceOf(disputes);
		expect(dsp.key).to.equal('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
		expect(dsp.httpConfiguration.timeout).to.equal(5000);
	});

	it("should set http configuration and key in constructor", async () => {
		const dsp = new disputes('sk_test_43ed9a7f-4799-461d-b201-a70507878b51', {
			timeout: 4000,
			environment: Environment.Sandbox
		});
		expect(dsp.key).to.equal('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
		expect(dsp.httpConfiguration.timeout).to.equal(4000);
	});

	it("should set http configuration and key with parameter", async () => {
		const dsp = new disputes('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');

		dsp.httpConfiguration = {
			timeout: 4000,
			environment: Environment.Sandbox
		};

		dsp.key = 'sk_test_43ed9a7f-4799-461d-b201-a70507878b51';
		expect(dsp.key).to.equal('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
		expect(dsp.httpConfiguration.timeout).to.equal(4000);
	});

	it("should get disputes with filter", async () => {
		nock("https://api.sandbox.checkout.com")
			.get("/disputes?payment_id=pay_px5ffl4ar4auhkaoyjs76khspu")
			.reply(200, {
				"limit": 50,
				"skip": 0,
				"payment_id": "pay_px5ffl4ar4auhkaoyjs76khspu",
				"total_count": 1,
				"data": [
					{
						"id": "dsp_8bc3897aace79r4635ac",
						"category": "fraudulent",
						"status": "evidence_required",
						"amount": 1040,
						"currency": "USD",
						"payment_id": "pay_px5ffl4ar4auhkaoyjs76khspu",
						"payment_reference": "bill",
						"payment_method": "Visa",
						"payment_arn": "384251173",
						"received_on": "2019-08-08T16:18:43Z",
						"last_update": "2019-08-08T16:18:43Z",
						"evidence_required_by": "2019-08-18T00:00:00Z",
						"_links": {
							"self": {
								"href": "https://api.sandbox.checkout.com/disputes/dsp_8bc3897aace79r4635ac"
							}
						}
					}
				]
			});
		const dsp = new disputes('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
		const outcome = await dsp.get({
			payment_id: "pay_px5ffl4ar4auhkaoyjs76khspu"
		});
		expect(outcome.payment_id).to.equal("pay_px5ffl4ar4auhkaoyjs76khspu");
		expect(outcome.data[0].category).to.equal("fraudulent");
	});

	it("should throw unauthorised error", async () => {
		nock("https://api.sandbox.checkout.com")
			.get("/disputes")
			.reply(401);
		const dsp = new disputes('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');

		try {
			const outcome = await dsp.get();
			throw ({ err: 'err' })
		} catch (err) {
			const error = err as AuthenticationError;
			expect(err).to.be.instanceOf(AuthenticationError)
		}
	});


	it("should throw not found error", async () => {
		nock("https://api.sandbox.checkout.com")
			.get("/disputes")
			.reply(422, {
				"request_id": "0HL80RJLS76I7",
				"error_type": "request_invalid",
				"error_codes": [
					"payment_source_required"
				]
			});
		const dsp = new disputes('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');

		try {
			const outcome = await dsp.get();
			throw ({ err: 'err' })
		} catch (err) {
			expect(err).to.be.instanceOf(ValidationError)
		}
	});

	it("should get disputes by id", async () => {
		nock("https://api.sandbox.checkout.com")
			.get("/disputes/dsp_8bc3897aace79r4635ac")
			.reply(200, {
				"id": "dsp_8bc3897aace79r4635ac",
				"category": "fraudulent",
				"amount": 1040,
				"currency": "USD",
				"reason_code": "10.4",
				"status": "evidence_required",
				"received_on": "2019-08-08T16:18:43Z",
				"relevant_evidence": [
					"proof_of_delivery_or_service",
					"invoice_or_receipt",
					"customer_communication",
					"additional_evidence"
				],
				"evidence_required_by": "2019-08-18T00:00:00Z",
				"payment": {
					"id": "pay_px5ffl4ar4auhkaoyjs76khspu",
					"reference": "bill",
					"amount": 1040,
					"currency": "USD",
					"method": "Visa",
					"arn": "384251173",
					"processed_on": "2019-08-08T16:18:21Z"
				},
				"last_update": "2019-08-08T16:18:43Z",
				"_links": {
					"self": {
						"href": "https://api.sandbox.checkout.com/disputes/dsp_8bc3897aace79r4635ac"
					},
					"evidence": {
						"href": "https://api.sandbox.checkout.com/disputes/dsp_8bc3897aace79r4635ac/evidence"
					}
				}
			});
		const dsp = new disputes('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
		const outcome = await dsp.getDetails("dsp_8bc3897aace79r4635ac");
		expect(outcome.id).to.equal("dsp_8bc3897aace79r4635ac");
		expect(outcome.category).to.equal("fraudulent");
	});

	it("should throw unauthorised error", async () => {
		nock("https://api.sandbox.checkout.com")
			.get("/disputes/dsp_8bc3897aace79r4635ac")
			.reply(401);
		const dsp = new disputes('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');

		try {
			const outcome = await dsp.getDetails("dsp_8bc3897aace79r4635ac");
			throw ({ err: 'err' })
		} catch (err) {
			const error = err as AuthenticationError;
			expect(err).to.be.instanceOf(AuthenticationError)
		}
	});

	it("should throw unauthorised error", async () => {
		nock("https://api.sandbox.checkout.com")
			.get("/disputes/dsp_8bc3897aace79r4635ac")
			.reply(401);
		const dsp = new disputes('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');

		try {
			const outcome = await dsp.getDetails("dsp_8bc3897aace79r4635ac");
			throw ({ err: 'err' })
		} catch (err) {
			const error = err as AuthenticationError;
			expect(err).to.be.instanceOf(AuthenticationError)
		}
	});

	it("should throw not found error", async () => {
		nock("https://api.sandbox.checkout.com")
			.get("/disputes/dsp_8bc3897aace79r4635ac")
			.reply(404);
		const dsp = new disputes('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');

		try {
			const outcome = await dsp.getDetails("dsp_8bc3897aace79r4635ac");
			throw ({ err: 'err' })
		} catch (err) {
			const error = err as NotFoundError;
			expect(err).to.be.instanceOf(NotFoundError)
		}
	});

	it("should accept dispute", async () => {
		nock("https://api.sandbox.checkout.com")
			.post("/disputes/dsp_c5e3d97aace79t4635a3/accept")
			.reply(204);
		const dsp = new disputes('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
		try {
			const outcome = await dsp.accept("dsp_c5e3d97aace79t4635a3");
		} catch (err) {
			throw err;
		}
	});

	it("should throw unauthorised error", async () => {
		nock("https://api.sandbox.checkout.com")
			.post("/disputes/dsp_c5e3d97aace79t4635a3/accept")
			.reply(401);
		const dsp = new disputes('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
		try {
			const outcome = await dsp.accept("dsp_c5e3d97aace79t4635a3");
		} catch (err) {
			const error = err as AuthenticationError;
			expect(err).to.be.instanceOf(AuthenticationError)
		}
	});

	it("should throw unauthorised error", async () => {
		nock("https://api.sandbox.checkout.com")
			.post("/disputes/dsp_c5e3d97aace79t4635a3/accept")
			.reply(404);
		const dsp = new disputes('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
		try {
			const outcome = await dsp.accept("dsp_c5e3d97aace79t4635a3");
		} catch (err) {
			const error = err as NotFoundError;
			expect(err).to.be.instanceOf(NotFoundError)
		}
	});

	it("should provide evidence", async () => {
		nock("https://api.sandbox.checkout.com")
			.put("/disputes/dsp_c5e3d97aace79t4635a3/evidence")
			.reply(200);
		const dsp = new disputes('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
		try {
			const outcome = await dsp.provideEvidence({
				id: "dsp_c5e3d97aace79t4635a3"
			});
		} catch (err) {
			throw err;
		}
	});

	it("should throw unprocessable error", async () => {
		nock("https://api.sandbox.checkout.com")
			.put("/disputes/dsp_c5e3d97aace79t4635a3/evidence")
			.reply(400);
		const dsp = new disputes('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
		try {
			const outcome = await dsp.provideEvidence({
				id: "dsp_c5e3d97aace79t4635a3"
			});
		} catch (err) {
			const error = err as UnprocessableError;
			expect(err).to.be.instanceOf(UnprocessableError);
		}
	});

	it("should throw unauthorised error", async () => {
		nock("https://api.sandbox.checkout.com")
			.put("/disputes/dsp_c5e3d97aace79t4635a3/evidence")
			.reply(401);
		const dsp = new disputes('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
		try {
			const outcome = await dsp.provideEvidence({
				id: "dsp_c5e3d97aace79t4635a3"
			});
		} catch (err) {
			const error = err as AuthenticationError;
			expect(err).to.be.instanceOf(AuthenticationError);
		}
	});

	it("should throw not found error", async () => {
		nock("https://api.sandbox.checkout.com")
			.put("/disputes/dsp_c5e3d97aace79t4635a3/evidence")
			.reply(404);
		const dsp = new disputes('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
		try {
			const outcome = await dsp.provideEvidence({
				id: "dsp_c5e3d97aace79t4635a3"
			});
		} catch (err) {
			const error = err as NotFoundError;
			expect(err).to.be.instanceOf(NotFoundError)
		}
	});

	it("should throw validation error", async () => {
		nock("https://api.sandbox.checkout.com")
			.put("/disputes/dsp_c5e3d97aace79t4635a3/evidence")
			.reply(422);
		const dsp = new disputes('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
		try {
			const outcome = await dsp.provideEvidence({
				id: "dsp_c5e3d97aace79t4635a3"
			});
		} catch (err) {
			const error = err as ValidationError;
			expect(err).to.be.instanceOf(ValidationError)
		}
	});

	it("should provide evidence", async () => {
		nock("https://api.sandbox.checkout.com")
			.put("/disputes/dsp_c5e3d97aace79t4635a3/evidence")
			.reply(200);
		const dsp = new disputes('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
		try {
			const outcome = await dsp.provideEvidence({
				id: "dsp_c5e3d97aace79t4635a3"
			});
		} catch (err) {
			throw err;
		}
	});

	it("should get evidence", async () => {
		nock("https://api.sandbox.checkout.com")
			.get("/disputes/dsp_c5e3d97aace79t4635a3/evidence")
			.reply(200, {
				"proof_of_delivery_or_service_file": "file_jmbfgkjromvcrn9t4qu4",
				"proof_of_delivery_or_service_text": "Delivery slip signed by the customer",
				"proof_of_delivery_or_service_date_text": "Merchandise was delivered on 2018-12-30"
			});
		const dsp = new disputes('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
		try {
			const outcome = await dsp.getEvidence("dsp_c5e3d97aace79t4635a3");
			expect(outcome.proof_of_delivery_or_service_file).equal("file_jmbfgkjromvcrn9t4qu4")
		} catch (err) {
			throw err;
		}
	});

	it("should throw unauthorised error", async () => {
		nock("https://api.sandbox.checkout.com")
			.get("/disputes/dsp_c5e3d97aace79t4635a3/evidence")
			.reply(401);
		const dsp = new disputes('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
		try {
			const outcome = await dsp.getEvidence("dsp_c5e3d97aace79t4635a3");
		} catch (err) {
			const error = err as AuthenticationError;
			expect(err).to.be.instanceOf(AuthenticationError);
		}
	});

	it("should throw unauthorised error", async () => {
		nock("https://api.sandbox.checkout.com")
			.get("/disputes/dsp_c5e3d97aace79t4635a3/evidence")
			.reply(404);
		const dsp = new disputes('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
		try {
			const outcome = await dsp.getEvidence("dsp_c5e3d97aace79t4635a3");
		} catch (err) {
			const error = err as NotFoundError;
			expect(err).to.be.instanceOf(NotFoundError);
		}
	});

	it("should submit evidence", async () => {
		nock("https://api.sandbox.checkout.com")
			.post("/files")
			.reply(200, {
				"id": "file_6lbss42ezvoufcb2beo76rvwly",
				"_links": {
					"self": {
						"href": "https://api.checkout.com/files/file_6lbss42ezvoufcb2beo76rvwly"
					}
				}
			});
		const dsp = new disputes('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
		try {
			const outcome = await dsp.submitEvidence({
				path: './test.pdf',
				purpose: 'test'
			});
			expect(outcome.id).equal("file_6lbss42ezvoufcb2beo76rvwly")
		} catch (err) {
			throw err;
		}
	});

	it("should throw unauthorised error", async () => {
		nock("https://api.sandbox.checkout.com")
			.post("/files")
			.reply(401);
		const dsp = new disputes('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
		try {
			const outcome = await dsp.submitEvidence({
				path: './test.pdf',
				purpose: 'test'
			});
			expect(outcome.id).equal("file_6lbss42ezvoufcb2beo76rvwly")
		} catch (err) {
			const error = err as AuthenticationError;
			expect(err).to.be.instanceOf(AuthenticationError)
		}
	});

	it("should throw validation error", async () => {
		nock("https://api.sandbox.checkout.com")
			.post("/files")
			.reply(422);
		const dsp = new disputes('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
		try {
			const outcome = await dsp.submitEvidence({
				path: './test.pdf',
				purpose: 'test'
			});
			expect(outcome.id).equal("file_6lbss42ezvoufcb2beo76rvwly")
		} catch (err) {
			expect(err).to.be.instanceOf(ValidationError)
		}
	});

	it("should throw too many requests error", async () => {
		nock("https://api.sandbox.checkout.com")
			.post("/files")
			.reply(429);
		const dsp = new disputes('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
		try {
			const outcome = await dsp.submitEvidence({
				path: './test.pdf',
				purpose: 'test'
			});
			expect(outcome.id).equal("file_6lbss42ezvoufcb2beo76rvwly")
		} catch (err) {
			expect(err).to.be.instanceOf(TooManyRequestsError)
		}
	});


	it("should upload file", async () => {
		nock("https://api.sandbox.checkout.com")
			.post("/files")
			.reply(200, {
				"id": "file_6lbss42ezvoufcb2beo76rvwly",
				"_links": {
					"self": {
						"href": "https://api.checkout.com/files/file_6lbss42ezvoufcb2beo76rvwly"
					}
				}
			});
		const dsp = new disputes('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
		try {
			const outcome = await dsp.upload({
				path: './test.pdf',
				purpose: 'test'
			});
			expect(outcome.id).equal("file_6lbss42ezvoufcb2beo76rvwly")
		} catch (err) {
			throw err;
		}
	});

	it("should throw unauthorised error", async () => {
		nock("https://api.sandbox.checkout.com")
			.post("/files")
			.reply(401);
		const dsp = new disputes('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
		try {
			const outcome = await dsp.upload({
				path: './test.pdf',
				purpose: 'test'
			});
			expect(outcome.id).equal("file_6lbss42ezvoufcb2beo76rvwly")
		} catch (err) {
			const error = err as AuthenticationError;
			expect(err).to.be.instanceOf(AuthenticationError)
		}
	});

	it("should throw validation error", async () => {
		nock("https://api.sandbox.checkout.com")
			.post("/files")
			.reply(422);
		const dsp = new disputes('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
		try {
			const outcome = await dsp.upload({
				path: './test.pdf',
				purpose: 'test'
			});
			expect(outcome.id).equal("file_6lbss42ezvoufcb2beo76rvwly")
		} catch (err) {
			expect(err).to.be.instanceOf(ValidationError)
		}
	});

	it("should throw too many requests error", async () => {
		nock("https://api.sandbox.checkout.com")
			.post("/files")
			.reply(429);
		const dsp = new disputes('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
		try {
			const outcome = await dsp.upload({
				path: './test.pdf',
				purpose: 'test'
			});
			expect(outcome.id).equal("file_6lbss42ezvoufcb2beo76rvwly")
		} catch (err) {
			expect(err).to.be.instanceOf(TooManyRequestsError)
		}
	});











	it("should get file info", async () => {
		nock("https://api.sandbox.checkout.com")
			.get("/files/file_6lbss42ezvoufcb2beo76rvwly")
			.reply(200, {
				"id": "file_6lbss42ezvoufcb2beo76rvwly",
				"filename": "receipt.jpg",
				"purpose": "dispute_evidence",
				"size": 1024,
				"uploaded_on": "2019-05-17T16:48:52Z",
				"_links": {
					"self": {},
					"download": {}
				}
			});
		const dsp = new disputes('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
		try {
			const outcome = await dsp.getFileInfo("file_6lbss42ezvoufcb2beo76rvwly");
			console.log(outcome)
		} catch (err) {
			throw err;
		}
	});

	it("should throw unauthorised error", async () => {
		nock("https://api.sandbox.checkout.com")
			.get("/files/file_6lbss42ezvoufcb2beo76rvwly")
			.reply(401);
		const dsp = new disputes('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
		try {
			const outcome = await dsp.getFileInfo("file_6lbss42ezvoufcb2beo76rvwly");
			throw { err: "err" }
		} catch (err) {
			const error = err as AuthenticationError;
			expect(err).to.be.instanceOf(AuthenticationError)
		}
	});

	it("should throw not found error", async () => {
		nock("https://api.sandbox.checkout.com")
			.get("/files/file_6lbss42ezvoufcb2beo76rvwly")
			.reply(404);
		const dsp = new disputes('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
		try {
			const outcome = await dsp.getFileInfo("file_6lbss42ezvoufcb2beo76rvwly");
			console.log(outcome)
		} catch (err) {
			const error = err as NotFoundError;
			expect(err).to.be.instanceOf(NotFoundError)
		}
	});

	it("should throw too many request error", async () => {
		nock("https://api.sandbox.checkout.com")
			.get("/files/file_6lbss42ezvoufcb2beo76rvwly")
			.reply(429);
		const dsp = new disputes('sk_test_43ed9a7f-4799-461d-b201-a70507878b51');
		try {
			const outcome = await dsp.getFileInfo("file_6lbss42ezvoufcb2beo76rvwly");
			console.log(outcome)
		} catch (err) {
			expect(err).to.be.instanceOf(TooManyRequestsError)
		}
	});
});