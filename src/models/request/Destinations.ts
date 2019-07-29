import {
    Address,
    Phone,
    TokenDestinationType,
    IdDestinationType,
    CardDestinationType
} from "../types/Types";

/**
 * TokenDestination class
 *
 * @export
 * @class TokenDestination
 */
export class TokenDestination {
    private readonly type: string = "token";
    public token: string;
    public first_name: string;
    public last_name: string;
    public billing_address?: Address;
    public phone?: Phone;

    public constructor(destination: TokenDestinationType) {
        this.token = destination.token;
        this.first_name = destination.first_name;
        this.last_name = destination.last_name;
        this.billing_address = destination.billing_address;
        this.phone = destination.phone;
    }
}

/**
 * IdDestination class
 *
 * @export
 * @class IdDestination
 */
export class IdDestination {
    private readonly type: string = "id";
    public id: string;
    public first_name: string;
    public last_name: string;

    public constructor(destination: IdDestinationType) {
        this.id = destination.id;
        this.first_name = destination.first_name;
        this.last_name = destination.last_name;
    }
}

/**
 * CardDestination class
 *
 * @export
 * @class CardDestination
 */
export class CardDestination {
    private readonly type: string = "card";
    number: string;
    expiry_month: number;
    expiry_year: number;
    first_name: string;
    last_name: string;
    name?: string;
    billing_address?: Address;
    phone?: Phone;

    public constructor(destination: CardDestinationType) {
        this.number = destination.number;
        this.expiry_month = destination.expiry_month;
        this.expiry_year = destination.expiry_year;
        this.first_name = destination.first_name;
        this.last_name = destination.last_name;
        this.name = destination.name;
        this.billing_address = destination.billing_address;
        this.phone = destination.phone;
    }
}
