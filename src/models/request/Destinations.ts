import {
    Address,
    Phone,
    TokenDestinationType,
    IdDestinationType,
    CardDestinationType
} from "../types/Types";

class BaseDestination {
    private readonly type: string;
    public constructor(type: string) {
        this.type = type;
    }
}

/**
 * TokenDestination class
 *
 * @export
 * @class TokenDestination
 */
export class TokenDestination extends BaseDestination {
    public token: string;
    public first_name: string;
    public last_name: string;
    public billing_address?: Address;
    public phone?: Phone;

    public constructor(destination: TokenDestinationType) {
        super("token")
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
export class IdDestination extends BaseDestination {
    public id: string;
    public first_name: string;
    public last_name: string;

    public constructor(destination: IdDestinationType) {
        super("id");
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
export class CardDestination extends BaseDestination {
    number: string;
    expiry_month: number;
    expiry_year: number;
    first_name: string;
    last_name: string;
    name?: string;
    billing_address?: Address;
    phone?: Phone;

    public constructor(destination: CardDestinationType) {
        super("card");
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
