import {
    Address,
    Phone,
    CardSourceType,
    AppleTokenData,
    TokenData,
    GoogleTokenData
} from "../types/Types";



/**
 * CardSource class
 *
 * @export
 * @class CardSource
 */
export class CardSource {
    private readonly type: string = "card";
    public number: string;
    public expiry_month: string;
    public expiry_year: string;
    public name?: string;
    public cvv?: string;
    public stored?: boolean;
    public billing_address?: Address;
    public phone?: Phone;

    public constructor(source: CardSourceType) {
        this.number = source.number;
        this.expiry_month = source.expiry_month;
        this.expiry_year = source.expiry_year;
        this.name = source.name;
        this.cvv = source.cvv;
        this.stored = source.stored;
        this.billing_address = source.billing_address;
        this.phone = source.phone;
    }
}

/**
 * ApplePaySource class
 *
 * @export
 * @class ApplePaySource
 */
export class ApplePaySource {
    private readonly type: string = "applepay";
    public token_data: TokenData<AppleTokenData>;

    public constructor(source: TokenData<AppleTokenData>) {
        this.token_data = source;
    }
}


/**
 * GooglePaySource class
 *
 * @export
 * @class GooglePaySource
 */
export class GooglePaySource {
    private readonly type: string = "googlepay";
    public token_data: TokenData<GoogleTokenData>;

    public constructor(source: TokenData<GoogleTokenData>) {
        this.token_data = source;
    }
}

