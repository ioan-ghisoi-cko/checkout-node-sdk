import { PaymentError } from "../types/Types";
/**
 * Error raised for pre-api value validation
 *
 * @export
 * @class ValueError
 * @extends {Error}
 */
export class ApiTimeout extends Error {
    constructor() {
        super("ApiTimeout");
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = ApiTimeout.name;
    }
}

/**
 * AuthenticationError
 *
 * @export
 * @class AuthenticationError
 * @extends {Error}
 */
export class AuthenticationError extends Error {
    public http_code = 401;

    constructor(message?: string) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = AuthenticationError.name;
    }
}

/**
 * ActionNotAllowed
 *
 * @export
 * @class AuthenticationError
 * @extends {Error}
 */
export class ActionNotAllowed extends Error {
    public http_code = 403;

    constructor(message = "ActionNotAllowed") {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = ActionNotAllowed.name;
    }
}

/**
 * UrlAlreadyRegistered
 *
 * @export
 * @class UrlAlreadyRegistered
 * @extends {Error}
 */
export class UrlAlreadyRegistered extends Error {
    public http_code = 409;

    constructor(message = "UrlAlreadyRegistered") {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = UrlAlreadyRegistered.name;
    }
}

/**
 * NotFoundError
 *
 * @export
 * @class AuthenticationError
 * @extends {Error}
 */
export class NotFoundError extends Error {
    public http_code = 404;

    constructor(message = "NotFoundError") {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = NotFoundError.name;
    }
}

/**
 * ValidationError
 *
 * @export
 * @class ValidationError
 * @extends {Error}
 */
export class ErrorWithBody extends Error {
    public http_code: number;
    public body: PaymentError;

    constructor(http_code: number, error: PaymentError, message?: string) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.http_code = http_code;
        this.body = error;
    }
}


/**
 * ValidationError
 *
 * @export
 * @class ValidationError
 * @extends {Error}
 */
export class ValidationError extends ErrorWithBody {
    constructor(error: PaymentError, message = "ValidationError") {
        super(422, error, message);
    }
}

/**
 * TooManyRequestsError
 *
 * @export
 * @class TooManyRequestsError
 * @extends {Error}
 */
export class TooManyRequestsError extends ErrorWithBody {
    constructor(error: PaymentError, message = "TooManyRequestsError") {
        super(429, error, message);
    }
}

/**
 * BadGateway
 *
 * @export
 * @class BadGateway
 * @extends {Error}
 */
export class BadGateway extends Error {
    public http_code = 502;

    constructor() {
        super("Bad gateway");
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

/**
 * ApiError
 *
 * @export
 * @class HttpError
 * @extends {Error}
 */
export class ApiError extends Error {
    constructor(public error: any) {
        super("API Error");
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = "API Error";
    }
}
