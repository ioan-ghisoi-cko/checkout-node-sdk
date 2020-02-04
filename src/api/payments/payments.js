import { determineError } from "../../services/errors";
import fetch from "node-fetch";
import http from "../../services/http";
import {
    validatePayment,
    setSourceOrDestinationType
} from "../../services/validation";
const pjson = require("../../../package.json");

export default class Payments {
    constructor(config) {
        this.config = config;
    }

    async request(body, idempotencyKey) {
        try {
            setSourceOrDestinationType(body);
            validatePayment(body);
            const response = await http(
                fetch,
                { timeout: this.config.timeout },
                {
                    method: "post",
                    url: `${this.config.host}/payments`,
                    headers:
                        idempotencyKey !== undefined
                            ? {
                                  Authorization: this.config.sk,
                                  "Cko-Idempotency-Key": idempotencyKey
                              }
                            : { Authorization: this.config.sk },
                    // Add metadata, to be able to identify requests from this SDK
                    body: {
                        ...body,
                        metadata: {
                            ...body.metadata,
                            sdk: "node",
                            sdk_version: pjson.version
                        }
                    }
                }
            );

            const json = await response.json;

            let isCompleted = false;
            let isFlagged = false;
            let requiresRedirect = false;

            if (json.destination) {
                if (json.approved && json.status === "Paid") {
                    isCompleted = true;
                }
                isFlagged = false;
                requiresRedirect = false;
            } else {
                isCompleted =
                    json.status === "Pending"
                        ? false
                        : json.approved &&
                          json.risk.flagged !== true &&
                          json.status === "Authorized" &&
                          json.response_summary === "Approved";
                isFlagged =
                    json.status === "Pending" ? false : json.risk.flagged;
                requiresRedirect = json.status === "Pending";
            }

            // If the redirection URL exists add it to the response body as 'redirectLink'
            let redirectLink = undefined;
            if (requiresRedirect && json._links.redirect) {
                redirectLink = json._links.redirect.href;
            }
            return {
                ...json,
                isCompleted,
                isFlagged,
                requiresRedirect,
                redirectLink
            };
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }

    async get(id) {
        try {
            const getPayment = await this._getHandler(
                `${this.config.host}/payments/${id}`
            );
            return getPayment.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    async getActions(id) {
        try {
            const getPaymentActions = await this._getHandler(
                `${this.config.host}/payments/${id}/actions`
            );
            return getPaymentActions.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    async capture(paymentId, body) {
        const response = await this._actionHandler("captures", paymentId, body);
        return response;
    }

    async refund(paymentId, body) {
        const response = await this._actionHandler("refunds", paymentId, body);
        return response;
    }

    async void(paymentId, body) {
        const response = await this._actionHandler("voids", paymentId, body);
        return response;
    }

    async _actionHandler(action, paymentId, body) {
        try {
            const response = await http(
                fetch,
                { timeout: this.config.timeout },
                {
                    method: "post",
                    url: `${this.config.host}/payments/${paymentId}/${action}`,
                    headers: {
                        Authorization: this.config.sk
                    },
                    body: body !== undefined ? body : {}
                }
            );
            return response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    async _getHandler(url) {
        const response = await http(
            fetch,
            { timeout: this.config.timeout },
            {
                method: "get",
                url,
                headers: {
                    Authorization: this.config.sk
                }
            }
        );
        return response;
    }
}
