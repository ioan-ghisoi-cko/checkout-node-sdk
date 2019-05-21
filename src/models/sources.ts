import {
    Address,
    Phone,
    NetworkTokenType,
    InfoFields,
    CardSourceType,
    TokenSourceType,
    IdSourceType,
    CustomerSourceType,
    NetworkTokenSourceType,
    BoletoSourceType,
    GiropaySourceType,
    IdealSourceType,
    KlarnaSourceType,
    QiwiSourceType
} from "./types";

export class TokenSource {
    private readonly type: string = 'token';
    public token: string;
    public billing_address?: Address;
    public phone?: Phone

    public constructor(source: TokenSourceType) {
        this.token = source.token;
        this.billing_address = source.billing_address;
        this.phone = source.phone;
    }
}

export class IdSource {
    private readonly type: string = 'id';
    public id: string;
    public cvv?: string;

    public constructor(source: IdSourceType) {
        this.id = source.id;
        this.cvv = source.cvv;
    }
}

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

export class CustomerSource {
    private readonly type: string = 'customer';
    public id?: string;
    public email?: string;

    public constructor(source: CustomerSourceType) {
        this.id = source.id;
        this.email = source.email;
    }
}

export class NetworkTokenSource {
    private readonly type: string = 'network_token';
    public token: string;
    public expiry_month: number;
    public expiry_year: number;
    public token_type: NetworkTokenType;
    public cryptogram: string;
    public eci: string;
    public stored?: string;
    public name?: string;
    public cvv?: string;
    public billing_address?: Address;
    public phone?: Phone;

    public constructor(source: NetworkTokenSourceType) {
        this.token = source.token;
        this.expiry_month = source.expiry_month;
        this.expiry_year = source.expiry_year;
        this.token_type = source.token_type;
        this.cryptogram = source.cryptogram;
        this.eci = source.eci;
        this.stored = source.stored;
        this.name = source.name;
        this.cvv = source.cvv;
        this.billing_address = source.billing_address;
        this.phone = source.phone;
    }
}

export class AlipaySource {
    private readonly type: string = 'alipay';

    public constructor() { }
}

export class BoletoSource {
    private readonly type: string = 'boleto';
    public birthDate: string;
    public cpf: string;
    public customerName: string;

    public constructor(source: BoletoSourceType) {
        this.birthDate = source.birthDate;
        this.cpf = source.cpf;
        this.customerName = source.customerName;
    }
}

export class GiropaySource {
    private readonly type: string = 'giropay';
    public purpose: string;
    public bic: string;
    public iban?: string;
    public info_fields?: InfoFields;

    public constructor(source: GiropaySourceType) {
        this.purpose = source.purpose;
        this.bic = source.bic;
        this.iban = source.iban;
        this.info_fields = source.info_fields;
    }
}

export class IdealSource {
    private readonly type: string = 'ideal';
    public description: string;
    public bic: string;
    public language?: string;

    public constructor(source: IdealSourceType) {
        this.description = source.description;
        this.bic = source.bic;
        this.language = source.language;
    }
}

export class KlarnaSource {
    private readonly type: string = 'klarna';
    public authorization_token: string;
    public locale: string;
    public purchase_country: string;
    public auto_capture?: boolean;
    public billing_address: any;
    public shipping_address?: any;
    public tax_amount: number;
    public products: any;
    public customer?: any;
    public merchant_reference1?: string;
    public merchant_reference2?: string;
    public merchant_data?: any;

    public constructor(source: KlarnaSourceType) {
        this.authorization_token = source.authorization_token;
        this.locale = source.locale;
        this.purchase_country = source.purchase_country;
        this.auto_capture = source.auto_capture;
        this.billing_address = source.billing_address;
        this.shipping_address = source.shipping_address;
        this.tax_amount = source.tax_amount;
        this.products = source.products;
        this.customer = source.customer;
        this.merchant_reference1 = source.merchant_reference1;
        this.merchant_reference2 = source.merchant_reference2;
        this.merchant_data = source.merchant_data;
    }
}

export class PoliSource {
    private readonly type: string = 'poli';

    public constructor() { }
}

export class QiwiSource {
    private readonly type: string = 'qiwi';
    public walletId: string;

    public constructor(source: QiwiSourceType) {
        this.walletId = source.walletId;
    }
}

export class SafetypaySource {
    private readonly type: string = 'safetypay';

    public constructor() { }
}

export class SofortSource {
    private readonly type: string = 'sofort';

    public constructor() { }
}
