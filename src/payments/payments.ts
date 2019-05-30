import fetch from "node-fetch";
import {
    PaymentRequest,
    PaymentOutcome,
    _PaymentError,
} from "../models/types";
import { HttpConfiguration, Http } from '../index'
import * as errors from '../models/errors';
import { PaymentProcessed, PaymentActionRequired } from '../models/responses';


export default class Payments {
    key: string;
    configuration: HttpConfiguration;

    public request = async <T>(
        arg: PaymentRequest<T>,
    ): Promise<PaymentOutcome> => {
        const http = new Http(this.configuration);
        try {
            var response = await http.send({
                method: 'post',
                path: '/payments',
                authorization: this.key,
                body: arg
            });

            switch (response.status) {
                case 201:
                    return {
                        http_code: response.status,
                        body: new PaymentProcessed(await response.json)
                    }
                    break;
                case 202:
                    return {
                        http_code: response.status,
                        body: new PaymentActionRequired(await response.json)
                    };
                    break;
                case 401:
                    throw new errors.AuthenticationError('AuthenticationError')
                    break;
                case 422:
                    throw new errors.ValidationError(await response.json)
                    break;
                // case 429:
                //     throw new errors.TooManyRequestsError(await response.json)
                //     break;
                // case 404:
                //     throw new errors.ResourceNotFoundError(await response.json)
                //     break;
                // case 409:
                //     throw new errors.UrlAlreadyRegistered()
                //     break;
                // case 409:
                //     throw new errors.UrlAlreadyRegistered()
                //     break;
                // case 502:
                //     throw new errors.BadGateway()
                //     break;
                default:
                    throw await response.json
                    break;
            }
        } catch (err) {
            throw err;
        }
    };

    public constructor(key: string, http_options: HttpConfiguration) {
        this.key = key;
        this.configuration = http_options;
    }

    public setHttpConfiguration = (options: HttpConfiguration) => {
        this.configuration = options;
    };


    public setSecretKey = (key: string) => {
        this.key = key;
    };
}
