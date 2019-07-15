import {
    Customer,
    AddSourceLinks,
    SepaMandateReference,
    AddSourceResponseType,
    Address,
    Phone,
    CreateTokenResponseType
} from "../../index";


/**
 * CreateTokenResponse class
 *
 * @export
 * @class CreateTokenResponse
 */
export class CreateTokenResponse {
    public type: string;
    public token: string;
    public expires_on: string;
    public expiry_month: number;
    public expiry_year: number;
    public scheme: string;
    public last4: string;
    public bin: string;
    public card_type: string;
    public card_category: string;
    public issuer: string;
    public issuer_country: string;
    public product_id: string;
    public product_type: string;
    public billing_address?: Address;
    public phone?: Phone;
    public name?: string;

    constructor(response: CreateTokenResponseType) {
        this.type = response.type;
        this.token = response.token;
        this.expires_on = response.expires_on;
        this.expiry_month = response.expiry_month;
        this.expiry_year = response.expiry_year;
        this.scheme = response.scheme;
        this.last4 = response.last4;
        this.bin = response.bin;
        this.card_type = response.card_type;
        this.card_category = response.card_category;
        this.issuer = response.issuer;
        this.issuer_country = response.issuer_country;
        this.product_id = response.product_id;
        this.product_type = response.product_type;
        this.billing_address = response.billing_address;
        this.phone = response.phone;
        this.name = response.name;
    }
}
