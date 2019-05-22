import {
    CheckoutConfiguration
} from "./models/types";

export class Configuration {
    public static readonly LIVE_BASE_URL = "https://api.checkout.com";
    public static readonly SANDBOX_BASE_URL =
        "https://api.sandbox.checkout.com";
    public static readonly DEFAULT_RETRIES = 0;
    public static readonly DEFAULT_TIMEOUT = 5000;
    public retries: number;
    public timeout: number;

    public constructor(config: CheckoutConfiguration) {
        this.retries = config.retries;
        this.timeout = config.timeout;
    }
}
