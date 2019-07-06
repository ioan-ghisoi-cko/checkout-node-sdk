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
 * Error raised for pre-api value validation
 *
 * @export
 * @class ValueError
 * @extends {Error}
 */
// export class ValueError extends Error {
// 	constructor(message?: string) {
// 		super(message);
// 		Object.setPrototypeOf(this, new.target.prototype);
// 		this.name = ValueError.name;
// 	}
// }

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
export class ValidationError extends Error {
    public http_code = 422;
    public body: PaymentError;

    constructor(error: PaymentError, message = "ValidationError") {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = ValidationError.name;
        this.body = error;
    }
}


/**
 * TooManyRequestsError
 *
 * @export
 * @class TooManyRequestsError
 * @extends {Error}
 */
export class TooManyRequestsError extends Error {
    public http_code = 429;
    public body: PaymentError;

    constructor(error: PaymentError, message = "TooManyRequestsError") {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = TooManyRequestsError.name;
        this.body = error;
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
