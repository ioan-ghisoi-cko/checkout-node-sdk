import {
    HttpConfigurationType,
    Http,
    Environment,
    DEFAULT_TIMEOUT,
    GetDisputesParams,
    GetDisputeEvidenceResponse,
    ProvideDisputesEvidenceRequestType,
    SubmitEvidenceResponse,
    GetFileInfoResponse,
    SubmitEvidenceType,
    UploadFileResponse
} from "../index";
import {
    GetDisputesResponse,
    GetDisputeDetailsResponse,
} from "../models/response/index";
import { determineError } from "../utils/ErrorHandler";
import BaseEndpoint from "./BaseEndpoint";

const querystring = require("querystring");

export default class Disputes extends BaseEndpoint {


    /**
     * Creates an instance of Events.
     * @param {string} key
     * @param {http_options} HttpConfigurationType
     * @param {HttpConfigurationType.timeout} HttpConfigurationType.timeout HTTP request timeout
     * @param {HttpConfigurationType.environment} HttpConfigurationType.environment default: Sandbox; API Environment
     * @memberof Events
     */
    constructor(
        key: string,
        http_options: HttpConfigurationType = {
            timeout: DEFAULT_TIMEOUT, environment: Environment.Sandbox
        }
    ) {
        super(key, http_options);
    }

    public get = async (arg?: GetDisputesParams): Promise<GetDisputesResponse> => {
        try {
            // build query params
            let params = querystring.stringify(arg).length > 0 ? `?${querystring.stringify(arg)}` : '';
            const get = await this._getHandler(`${this.httpConfiguration.environment}/disputes${params}`);
            return new GetDisputesResponse(await get.json);
        } catch (err) {
            throw await determineError(err);
        }
    };

    public getDetails = async (id: string): Promise<GetDisputeDetailsResponse> => {
        try {
            const getDetails = await this._getHandler(`${this.httpConfiguration.environment}/disputes/${id}`);
            return new GetDisputeDetailsResponse(await getDetails.json);
        } catch (err) {
            throw await determineError(err);
        }
    };

    public accept = async (id: string) => {
        try {
            const http = new Http(this.httpConfiguration);
            const response = await http.send({
                method: "post",
                url: `${this.httpConfiguration.environment}/disputes/${id}/accept`,
                headers: {
                    Authorization: this.key
                },
                body: {}
            });
        } catch (err) {
            throw await determineError(err);
        }
    };

    public provideEvidence = async (arg: ProvideDisputesEvidenceRequestType) => {
        try {
            const http = new Http(this.httpConfiguration);
            await http.send({
                method: "put",
                url: `${this.httpConfiguration.environment}/disputes/${arg.id}/evidence`,
                headers: {
                    Authorization: this.key
                },
                body: arg !== undefined ? arg : {}
            });
        } catch (err) {
            throw await determineError(err);
        }
    };

    public getEvidence = async (id: string): Promise<GetDisputeEvidenceResponse> => {
        try {
            const getDetails = await this._getHandler(`${this.httpConfiguration.environment}/disputes/${id}/evidence`);
            return new GetDisputeEvidenceResponse(await getDetails.json);
        } catch (err) {
            throw await determineError(err);
        }
    };

    public submitEvidence = async (arg: SubmitEvidenceType): Promise<SubmitEvidenceResponse> => {
        try {
            const http = new Http(this.httpConfiguration);
            const ourcome = await http.send({
                method: "post",
                url: `${this.httpConfiguration.environment}/files`,
                headers: {
                    Authorization: this.key
                },
                body: arg
            });
            return new SubmitEvidenceResponse(await ourcome.json);
        } catch (err) {
            throw await determineError(err);
        }
    };

    public upload = async (arg: SubmitEvidenceType): Promise<UploadFileResponse> => {
        try {
            const http = new Http(this.httpConfiguration);
            const ourcome = await http.send({
                method: "post",
                url: `${this.httpConfiguration.environment}/files`,
                headers: {
                    Authorization: this.key
                },
                body: arg
            });
            return new UploadFileResponse(await ourcome.json);
        } catch (err) {
            throw await determineError(err);
        }
    };

    public getFileInfo = async (id: string): Promise<GetFileInfoResponse> => {
        try {
            const getDetails = await this._getHandler(`${this.httpConfiguration.environment}/files/${id}`);
            return new GetFileInfoResponse(await getDetails.json);
        } catch (err) {
            throw await determineError(err);
        }
    };

    /**
     * Handle all GET requests to remove duplication
     *
     * @private
     * @memberof Events
     */
    private _getHandler = async (
        url: string,
    ): Promise<any> => {
        const http = new Http(this.httpConfiguration);
        return http.send({
            method: "get",
            url,
            headers: {
                Authorization: this.key
            },
        });
    }
}
