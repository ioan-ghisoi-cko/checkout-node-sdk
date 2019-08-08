import {
    GetFileInfoResponseType,
    GetFileInfoLinks
} from "../../index";

/**
 *
 *
 * @export
 * @class GetFileInfoResponse
 */
export class GetFileInfoResponse {
    public id: string;
    public filename: string;
    public purpose: string;
    public size: number;
    public uploaded_on: string;
    public _links: GetFileInfoLinks;

    constructor(response: GetFileInfoResponseType) {
        this.id = response.id;
        this.filename = response.filename;
        this.purpose = response.purpose;
        this.size = response.size;
        this.uploaded_on = response.uploaded_on;
        this._links = response._links;
    }
}

