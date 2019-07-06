import {
    HttpConfigurationType,
    Environment,
    DEFAULT_TIMEOUT
} from "../index";


export default class BaseEndpoint {

    key: string;
    httpConfiguration: HttpConfigurationType;

    constructor(
        key: string,
        http_options: HttpConfigurationType = {
            timeout: DEFAULT_TIMEOUT, environment: Environment.Sandbox
        }
    ) {
        this.key = key;
        this.httpConfiguration = http_options;
    }
}
