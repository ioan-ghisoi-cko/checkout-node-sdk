import {
    Address,
    Phone,
    CardSourceType,
} from "./Types";

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
