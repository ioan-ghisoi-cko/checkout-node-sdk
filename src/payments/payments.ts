import fetch from 'node-fetch';
import { constants } from '../common/constants';
import { PaymentRequest, PaymentActionRequired, PaymentSuccess, PaymentOutcome, PaymentError } from '../models/types';

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

        if (json.approved !== undefined && json.risk !== undefined) {
            return {
                http_code: response.status,
                is_successful: !json.risk.flagged && json.approved,
                is_approved: json.approved,
                is_pending: response.status === 202 || json.risk.flagged,
                body: json as PaymentSuccess,
            }
        } else {
            return {
                http_code: response.status,
                is_successful: false,
                is_approved: false,
                is_pending: false,
                body: json as PaymentSuccess,
            }
        }

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

    // public request = async <T>(arg: T): Promise<
    //     PaymentOutcome> => {
    //     const response = await fetch(`${constants.SANDBOX_BASE_URL}/payments`,
    //         {
    //             method: 'post',
    //             body: JSON.stringify(arg),
    //             headers: { 'Content-Type': 'application/json', 'Authorization': this.key },
    //         });
    //     const json = await response.json();

    //     if (json.approved !== undefined && json.risk !== undefined) {
    //         return {
    //             http_code: response.status,
    //             is_successful: !json.risk.flagged && json.approved,
    //             is_approved: json.approved,
    //             is_pending: response.status === 202 || json.risk.flagged,
    //             body: json as PaymentSuccess,
    //         }
    //     } else {
    //         return {
    //             http_code: response.status,
    //             is_successful: false,
    //             is_approved: false,
    //             is_pending: false,
    //             body: json as PaymentSuccess,
    //         }
    //     }

    //     switch (response.status) {
    //         case 201:
    //             return {
    //                 http_code: response.status,
    //                 is_successful: true,
    //                 is_approved: true,
    //                 is_pending: false,
    //                 body: json as PaymentSuccess,
    //             }
    //             break;
    //         case 202:
    //             return {
    //                 http_code: response.status,
    //                 is_successful: false,
    //                 is_approved: false,
    //                 is_pending: true,
    //                 body: json as PaymentActionRequired,
    //             }
    //             break;
    //         case 422:
    //             throw {
    //                 http_code: response.status,
    //                 is_successful: false,
    //                 is_approved: false,
    //                 is_pending: false,
    //                 body: json as PaymentError,
    //             }
    //             break;
    //         case 429:
    //             throw {
    //                 http_code: response.status,
    //                 is_successful: false,
    //                 is_approved: false,
    //                 is_pending: false,
    //                 body: json as PaymentError,
    //             }
    //             break;
    //         default:
    //             throw {
    //                 http_code: response.status,
    //                 is_successful: false,
    //                 is_approved: false,
    //                 is_pending: false,
    //                 body: json,
    //             }
    //             break;
    //     }
    // }

    public constructor(key: string) {
        this.key = key;
    }
}
