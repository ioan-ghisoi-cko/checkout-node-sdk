import { determineError } from "./ErrorHandler";
import { Http } from "../services/Http";
import { RequestType, HttpConfigurationType, RequestHandlerType } from "../models/types/Types";

export const performRequest = async (
    args: RequestHandlerType
): Promise<any> => {
    const { config, method, url, headers, body } = args;
    const http = new Http(config);
    try {
        // In case the body is undefined remove it completely
        const httpParams = body === undefined ? {
            method,
            url,
            headers,
        } :
            {
                method,
                url,
                headers,
                body
            };
        const response = await http.send(httpParams);
        return await response.json;
    } catch (err) {
        throw await determineError(err);
    }
};
