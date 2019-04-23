import fetch from 'node-fetch';
import { constants } from '../common/constants';
import { PaymentRequest, PaymentActionRequired, PaymentResponse, PaymentOutcome, PaymentError } from '../models/types';

export default class Payments {
    key: string = ''

    public request = async <T>(arg: PaymentRequest<T>): Promise<
        PaymentOutcome> => {
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
    }

    public constructor(key: string) {
        this.key = key;
    }
}
