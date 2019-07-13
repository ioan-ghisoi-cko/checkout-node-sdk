import {
    ApiError,
    ApiTimeout,
    AuthenticationError,
    ValidationError,
    TooManyRequestsError,
    BadGateway,
    NotFoundError,
    ActionNotAllowed,
    NotConfiguredError
} from "../models/response/HttpErrors";

export const determineError = async (err: any): Promise<any> => {
    // Fot time outs
    if (err.type === "request-timeout") {
        return new ApiTimeout();
    }

    // For 'no body' response, replace with empty object
    const errorJSON = err.json !== undefined ? await
        err.json.then(data => {
            return data;
        }).catch(err => { }) : {};

    switch (err.status) {
        case 401:
            return new AuthenticationError();
        case 204:
            return new NotConfiguredError();
        case 404:
            return new NotFoundError();
        case 403:
            return new ActionNotAllowed();
        case 422:
            return new ValidationError(await errorJSON);
        case 429:
            return new TooManyRequestsError(await errorJSON);
        case 502:
            return new BadGateway();
        default:
            return new ApiError(await errorJSON);
    }
}
