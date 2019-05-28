import {
    HttpConfig,
    EnvironmentType,
    Environment
} from "./index";

const DEFAULT_TIMEOUT = 5000;

export class HttpConfiguration {
    public timeout: number;
    public environment: EnvironmentType;

    public constructor(config?: HttpConfig) {
        this.timeout = config !== undefined ? config.timeout : DEFAULT_TIMEOUT;
        this.environment = config !== undefined && config.environment !== undefined ? config.environment : Environment.Sandbox;
    }
}
