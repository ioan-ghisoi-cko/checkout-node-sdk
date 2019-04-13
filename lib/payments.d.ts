import { PaymentRequest, PaymentOutcome } from './types';
export default class Payments {
    key: string;
    request: (request_body: PaymentRequest) => Promise<PaymentOutcome>;
    constructor(key: string);
}
