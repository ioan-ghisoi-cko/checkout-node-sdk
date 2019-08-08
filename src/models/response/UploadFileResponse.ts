import {
    UploadFileResponseType,
    UploadFileLinks
} from "../../index";

/**
 *
 *
 * @export
 * @class UploadFileResponse
 */
export class UploadFileResponse {
    public id: string;
    public _links: UploadFileLinks;

    constructor(response: UploadFileResponseType) {
        this.id = response.id;
        this._links = response._links;
    }
}

