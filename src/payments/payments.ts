import fetch from "node-fetch";
import {
    PaymentRequest,
    PaymentOutcome,
    _PaymentError,
} from "../models/types";
import { HttpConfiguration, Http } from '../index'
import { ValidationError } from '../models/errors';
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

            if (response.status === 201) {
                return {
                    http_code: response.status,
                    body: new PaymentProcessed(await response.json)
                };
            } else if (response.status === 202) {
                return {
                    http_code: response.status,
                    body: new PaymentActionRequired(await response.json)
                };
            } else {
                let error = await response.json as _PaymentError;
                throw new ValidationError(error, 'ValidationError')
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
}
