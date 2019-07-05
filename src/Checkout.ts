// import _payments from "./api/Payments";
// import { Environment, HttpConfigurationType } from "./index";
// import { DEFAULT_TIMEOUT } from "./config/Constants";

// export default class Checkout {
//     public payments: _payments;
//     public httpConfiguration: HttpConfigurationType = {
//         environment: Environment.Sandbox,
//         timeout: DEFAULT_TIMEOUT
//     };

//     constructor(public key?: string) {
//         this.payments = new _payments(key || "", this.httpConfiguration);
//     }

//     public setSecretKey = (key: string) => {
//         this.key = key;
//         this.payments.setKey(key);
//     };

//     public setHttpConfiguration = (httpConfiguration: HttpConfigurationType) => {
//         this.httpConfiguration = httpConfiguration;
//         this.payments.setHttpConfiguration(httpConfiguration);
//     };
// }
