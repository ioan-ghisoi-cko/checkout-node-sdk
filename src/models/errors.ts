import { _PaymentError } from './types'

/**
 * Error raised for pre-api value validation
 *
 * @export
 * @class ValueError
 * @extends {Error}
 */
export class ValueError extends Error {
    constructor(message?: string) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = ValueError.name;
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
    public http_code: number = 401;

    constructor(message?: string) {
        super(message)
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = AuthenticationError.name;
    }
}

/**
 * NotAllowedError
 *
 * @export
 * @class NotAllowedError
 * @extends {Error}
 */
// export class NotAllowedError extends Error {
//     public http_code: number = 403;

//     constructor(message?: string) {
//         super(message)
//         Object.setPrototypeOf(this, new.target.prototype);
//         this.name = NotAllowedError.name;
//     }
// }

/**
 * ResourceNotFoundError
 *
 * @export
 * @class ResourceNotFoundError
 * @extends {Error}
 */
// export class ResourceNotFoundError extends Error {
//     public http_code: number = 404;

//     constructor(message?: string) {
//         super(message)
//         Object.setPrototypeOf(this, new.target.prototype);
//         this.name = ResourceNotFoundError.name;
//     }
// }

/**
 * ValidationError
 *
 * @export
 * @class ValidationError
 * @extends {Error}
 */
export class ValidationError extends Error {
    public http_code: number = 422;
    public body: _PaymentError;

    constructor(error: _PaymentError, message?: string) {
        super(message)
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
// export class TooManyRequestsError extends Error {
//     public http_code: number = 429;
//     public body: _PaymentError;

//     constructor(error: _PaymentError, message?: string) {
//         super(message)
//         Object.setPrototypeOf(this, new.target.prototype);
//         this.name = ValidationError.name;
//         this.body = error;
//     }
// }

/**
 * BadGateway
 *
 * @export
 * @class BadGateway
 * @extends {Error}
 */
// export class BadGateway extends Error {
//     public http_code: number = 502;

//     constructor() {
//         super('Bad gateway')
//         Object.setPrototypeOf(this, new.target.prototype);
//     }
// }

/**
 * UrlAlreadyRegistered
 *
 * @export
 * @class UrlAlreadyRegistered
 * @extends {Error}
 */
// export class UrlAlreadyRegistered extends Error {
//     public http_code: number = 409;

//     constructor() {
//         super('Url already registered for another webhook')
//         Object.setPrototypeOf(this, new.target.prototype);
//     }
// }


/**
 * HttpError
 *
 * @export
 * @class HttpError
 * @extends {Error}
 */
// export class HttpError extends Error {
//     public http_code: number;
//     public body: any;

//     constructor(error: _PaymentError, http_code: number) {
//         super("HTTP error")
//         Object.setPrototypeOf(this, new.target.prototype);
//         this.name = HttpError.name;
//         this.http_code = http_code;
//         this.body = error;
//     }
// }
