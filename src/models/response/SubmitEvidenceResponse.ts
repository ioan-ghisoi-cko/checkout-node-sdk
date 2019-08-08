import {
    SubmitEvidenceResponseType,
    UploadFileLinks
} from "../../index";

/**
 *
 *
 * @export
 * @class SubmitEvidenceResponse
 */
export class SubmitEvidenceResponse {
    public id: string;
    public _links: UploadFileLinks;

    constructor(response: SubmitEvidenceResponseType) {
        this.id = response.id;
        this._links = response._links;
    }
}

