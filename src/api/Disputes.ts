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
     * Creates an instance of Disputes.
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


    /**
     * Returns a list of all disputes against your business.
     * This list is provided in chronological order, showing the latest updates first.
     * You can use the optional parameters to skip or limit results.
     *
     * @memberof Disputes
     * @param {arg}  GetDisputesParams filters for disputes
     * @return {Promise<GetDisputesResponse>} A promise to get disputes response.
     */
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

    /**
     * Returns all the details of a dispute using the dispute identifier.
     *
     * @memberof Disputes
     * @param {id}  /^(dsp)_(\w{26})$/ The dispute identifier
     * @return {Promise<GetDisputeDetailsResponse>} A promise to get disputes details response.
     */
    public getDetails = async (id: string): Promise<GetDisputeDetailsResponse> => {
        try {
            const getDetails = await this._getHandler(`${this.httpConfiguration.environment}/disputes/${id}`);
            return new GetDisputeDetailsResponse(await getDetails.json);
        } catch (err) {
            throw await determineError(err);
        }
    };

    /**
     * If a dispute is legitimate, you can choose to accept it. This will close it for you and remove it
     * from your list of open disputes. There are no further financial implications.
     *
     * @memberof Disputes
     * @param {id}  /^(dsp)_(\w{26})$/ The dispute identifier
     */
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

    /**
     * Adds supporting evidence to a dispute.
     *
     * @memberof Disputes
     * @param {arg}  /^(dsp)_(\w{26})$/ The dispute evidence
     */
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

    /**
     * Retrieves a list of the evidence submitted in response to a specific dispute.
     *
     * @memberof Disputes
     * @param {id}  /^(dsp)_(\w{26})$/ The dispute identifier
     * @return {Promise<GetDisputeEvidenceResponse>} A promise to get disputes evidence response.
     */
    public getEvidence = async (id: string): Promise<GetDisputeEvidenceResponse> => {
        try {
            const getDetails = await this._getHandler(`${this.httpConfiguration.environment}/disputes/${id}/evidence`);
            return new GetDisputeEvidenceResponse(await getDetails.json);
        } catch (err) {
            throw await determineError(err);
        }
    };

    /**
     * With this final request, you can submit the evidence that you have previously provided.
     * Make sure you have provided all the relevant information before using this request.
     * You will not be able to amend your evidence once you have submitted it.
     *
     * @memberof Disputes
     * @param {arg}  SubmitEvidenceType Evidence type
     * @return {Promise<SubmitEvidenceResponse>} A promise to submit evidence response.
     */
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

    /**
     * Upload a file to use as evidence in a dispute. Your file must be in either JPEG/JPG,
     * PNG or PDF format, and be no larger than 4MB.
     *
     * @memberof Disputes
     * @param {arg}  SubmitEvidenceType Evidence
     * @return {Promise<GetDisputeEvidenceResponse>} A promise to upload file response.
     */
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

    /**
     * Retrieve information about a file that was previously uploaded.
     *
     * @memberof Disputes
     * @param {id}  string The file identifier
     * @return {Promise<GetFileInfoResponse>} A promise to get file info response.
     */
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
