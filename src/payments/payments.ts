import fetch from 'node-fetch';
import { constants } from '../common/constants';
import { PaymentRequest, PaymentActionRequired, PaymentResponse, PaymentOutcome, PaymentError, HttpOptions } from '../models/types';

export default class Payments {
    key: string;
    http_options: HttpOptions;

    public request = async <T>(arg: PaymentRequest<T>, retry: number = this.http_options.reties): Promise<
        PaymentOutcome> => {
        try {
            const response = await fetch(`${constants.SANDBOX_BASE_URL}/payments`,
                {
                    method: 'post',
                    body: JSON.stringify(arg),
                    headers: { 'Content-Type': 'application/json', 'Authorization': this.key },
                });

            const json = await response.json();

            if (response.status === 201) {
                return {
                    http_code: response.status,
                    body: json as PaymentResponse
                };
            } else if (response.status === 202) {
                return {
                    http_code: response.status,
                    body: json as PaymentActionRequired
                };
            } else {
                throw {
                    http_code: response.status,
                    body: json as PaymentError
                };
            }
        } catch (err) {
            if (retry === 1 || retry < 1) throw err;
            return await this.request(arg, retry - 1);
        }
    };

    public constructor(key: string, http_options: HttpOptions) {
        this.key = key;
        this.http_options = http_options;
    }

    public setHttpOptions = (options: HttpOptions) => {
        this.http_options = options;
    }
}
