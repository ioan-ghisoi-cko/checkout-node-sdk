import fetch from 'node-fetch';
import { constants } from './constants';
import { PaymentRequest, PaymentActionRequired, PaymentSuccess, PaymentOutcome, PaymentError } from './types';

export default class Payments {
    key: string = ''

    public request = async (request_body: PaymentRequest): Promise<
        PaymentOutcome> => {
        const response = await fetch(`${constants.SANDBOX_BASE_URL}/payments`,
            {
                method: 'post',
                body: JSON.stringify(request_body),
                headers: { 'Content-Type': 'application/json', 'Authorization': this.key },
            });
        const json = await response.json();

        switch (response.status) {
            case 201:
                return {
                    http_code: response.status,
                    is_successful: true,
                    is_approved: true,
                    is_pending: false,
                    body: json as PaymentSuccess,
                }
                break;
            case 202:
                return {
                    http_code: response.status,
                    is_successful: false,
                    is_approved: false,
                    is_pending: true,
                    body: json as PaymentActionRequired,
                }
                break;
            case 422:
                throw {
                    http_code: response.status,
                    is_successful: false,
                    is_approved: false,
                    is_pending: false,
                    body: json as PaymentError,
                }
                break;
            case 429:
                throw {
                    http_code: response.status,
                    is_successful: false,
                    is_approved: false,
                    is_pending: false,
                    body: json as PaymentError,
                }
                break;
            default:
                throw {
                    http_code: response.status,
                    is_successful: false,
                    is_approved: false,
                    is_pending: false,
                    body: json,
                }
                break;
        }
    }

    public constructor(key: string) {
        this.key = key;
    }
}
