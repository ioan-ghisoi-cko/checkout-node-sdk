import {
    Address,
    Phone,
    CardSourceType,
    SourceRequest,
    Customer,
    SepaSourceData
} from "../types/Types";

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

export class Sources {
    private readonly type: string = "sepa";
    public reference?: string;
    public billing_address: Address;
    public phone?: Phone;
    public customer?: Customer;
    public source_data: SepaSourceData;

    public constructor(source: SourceRequest) {
        this.reference = source.reference;
        this.billing_address = source.billing_address;
        this.phone = source.phone;
        this.customer = source.customer;
        this.source_data = source.source_data;
    }
}
