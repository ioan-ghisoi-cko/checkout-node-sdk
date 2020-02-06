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

    /**
     * Sends payment or a payout requests.
     *
     * @memberof Payments
     * @param {Object} body Payment Request body.
     * @param {string} [idempotencyKey] Idempotency Key.
     * @return {Promise<Object>} A promise to payment response.
     */
    async request(body, idempotencyKey) {
        try {
            setSourceOrDestinationType(body);
            validatePayment(body);
            _addMetadata(body);

            const response = await http(
                fetch,
                { timeout: this.config.timeout },
                {
                    method: "post",
                    url: `${this.config.host}/payments`,
                    headers: _determineHeaders(this.config, idempotencyKey),
                    body
                }
            );
            return _addUtilityParams(await response.json);
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }

    /**
     * Returns the details of the payment with the specified identifier string.
     *
     * @memberof Payments
     * @param {string} id /^(pay|sid)_(\w{26})$/ The payment or payment session identifier.
     * @return {Promise<Object>} A promise to the get payment response.
     */
    async get(id) {
        try {
            const response = await _getHandler(
                this.config,
                `${this.config.host}/payments/${id}`
            );
            return response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Returns all the actions associated with a payment ordered by processing date in
     * descending order (latest first).
     *
     * @memberof Payments
     * @param {string} id /^(pay)_(\w{26})$/ The payment identifier.
     * @return {Promise<Object>} A promise to the getActions response.
     */
    async getActions(id) {
        try {
            const response = await _getHandler(
                this.config,
                `${this.config.host}/payments/${id}/actions`
            );
            return response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Captures a payment if supported by the payment method.
     *
     * @memberof Payments
     * @param {string} paymentId /^(pay)_(\w{26})$/ The payment or payment session identifier.
     * @param {Object} [body] Capture request body.
     * @return {Promise<Object>} A promise to the capture response.
     */
    async capture(paymentId, body) {
        try {
            const response = await _actionHandler(
                this.config,
                "captures",
                paymentId,
                body
            );
            return response;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Refunds a payment if supported by the payment method.
     *
     * @memberof Payments
     * @param {string} id /^(pay)_(\w{26})$/ The payment or payment session identifier.
     * @param {Object} [body] Refund request body.
     * @return {Promise<Object>} A promise to the refund response.
     */
    async refund(paymentId, body) {
        try {
            const response = await _actionHandler(
                this.config,
                "refunds",
                paymentId,
                body
            );
            return response;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Voids a payment if supported by the payment method.
     *
     * @memberof Payments
     * @param {string} id /^(pay)_(\w{26})$/ The payment or payment session identifier.
     * @param {Object} [body] Void request body.
     * @return {Promise<Object>} A promise to the void response.
     */
    async void(paymentId, body) {
        try {
            const response = await _actionHandler(
                this.config,
                "voids",
                paymentId,
                body
            );
            return response;
        } catch (err) {
            throw await determineError(err);
        }
    }
}

const _actionHandler = async (config, action, paymentId, body) => {
    try {
        const response = await http(
            fetch,
            { timeout: config.timeout },
            {
                method: "post",
                url: `${config.host}/payments/${paymentId}/${action}`,
                headers: {
                    Authorization: config.sk
                },
                body: body !== undefined ? body : {}
            }
        );
        return response.json;
    } catch (err) {
        throw err;
    }
};

const _getHandler = async (config, url) => {
    try {
        const response = await http(
            fetch,
            { timeout: config.timeout },
            {
                method: "get",
                url,
                headers: {
                    Authorization: config.sk
                }
            }
        );
        return response;
    } catch (err) {
        throw err;
    }
};

const _determineHeaders = (config, idempotencyKey) => {
    if (idempotencyKey !== undefined) {
        return {
            Authorization: config.sk,
            "Cko-Idempotency-Key": idempotencyKey
        };
    }
    return { Authorization: config.sk };
};

const _addMetadata = body => {
    body = {
        ...body,
        metadata: {
            ...body.metadata,
            sdk: "node",
            sdk_version: pjson.version
        }
    };
};

const _addUtilityParams = json => {
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
        isFlagged = json.status === "Pending" ? false : json.risk.flagged;
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
};
