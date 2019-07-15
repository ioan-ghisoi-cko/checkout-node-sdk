import {
    Customer,
    AddSourceLinks,
    SepaMandateReference,
    AddSourceResponseType
} from "../../index";


/**
 * AddSourceResponse class
 *
 * @export
 * @class AddSourceResponse
 */
export class AddSourceResponse {
    public id: string;
    public type: string;
    public response_code: string;
    public customer?: Customer;
    public response_data: SepaMandateReference;
    public _links: AddSourceLinks;

    constructor(response: AddSourceResponseType) {
        this.id = response.id;
        this.type = response.type;
        this.response_code = response.response_code;
        this.customer = response.customer;
        this.response_data = response.response_data;
        this._links = response._links;
    }
}
