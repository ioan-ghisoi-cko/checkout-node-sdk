import _payments from './payments';
declare class checkout {
    key: string;
    payments: _payments;
    constructor(key: string);
}
declare const api: (key: string) => checkout;
export default api;
