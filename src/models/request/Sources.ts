import {
    Address,
    Phone,
    CardSourceType,
    AppleTokenData,
    TokenData,
    GoogleTokenData,
    TokenSourceType,
    IdSourceType,
    CustomerSourceType,
    NetworkTokenSourceType,
    BoletoSourceType,
    GiropaySourceType,
    IdealSourceType,
    KlarnaSourceType,
    QiwiSourceType,
    InfoFields,
    NetworkTokenType,
    BancontactSourceType,
    EpsSourceType,
    FawrySourceType,
    FawryProduct,
    KlarnaAddress,
    KlarnaCustomer,
    KlarnaProduct,
    KnetSourceType,
    KnetLanguage,
    QpaySourceType
} from "../types/Types";

class BaseSource {
    private readonly type: string;
    public constructor(type: string) {
        this.type = type;
    }
}

export class TokenSource extends BaseSource {
    public token: string;
    public billing_address?: Address;
    public phone?: Phone

    public constructor(source: TokenSourceType) {
        super("token");
        this.token = source.token;
        this.billing_address = source.billing_address;
        this.phone = source.phone;
    }
}

export class IdSource extends BaseSource {
    public id: string;
    public cvv?: string;

    public constructor(source: IdSourceType) {
        super("id");
        this.id = source.id;
        this.cvv = source.cvv;
    }
}

/**
 * CardSource class
 *
 * @export
 * @class CardSource
 */
export class CardSource extends BaseSource {
    public number: string;
    public expiry_month: number;
    public expiry_year: number;
    public name?: string;
    public cvv?: string;
    public stored?: boolean;
    public billing_address?: Address;
    public phone?: Phone;

    public constructor(source: CardSourceType) {
        super("card");
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
export class ApplePaySource extends BaseSource {
    public token_data: TokenData<AppleTokenData>;

    public constructor(source: TokenData<AppleTokenData>) {
        super("applepay");
        this.token_data = source;
    }
}


/**
 * GooglePaySource class
 *
 * @export
 * @class GooglePaySource
 */
export class GooglePaySource extends BaseSource {
    public token_data: TokenData<GoogleTokenData>;

    public constructor(source: TokenData<GoogleTokenData>) {
        super("googlepay");
        this.token_data = source;
    }
}


export class CustomerSource extends BaseSource {
    public id?: string;
    public email?: string;

    public constructor(source: CustomerSourceType) {
        super("customer");
        this.id = source.id;
        this.email = source.email;
    }
}

export class NetworkTokenSource extends BaseSource {
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
        super("network_token");
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

export class AlipaySource extends BaseSource {
    public constructor() {
        super("alipay");
    }
}

export class BoletoSource extends BaseSource {
    public birthDate: string;
    public cpf: string;
    public customerName: string;

    public constructor(source: BoletoSourceType) {
        super("boleto");
        this.birthDate = source.birthDate;
        this.cpf = source.cpf;
        this.customerName = source.customerName;
    }
}

export class BancontactSource extends BaseSource {
    public payment_country: string;
    public account_holder_name: string;
    public billing_descriptor?: string;

    public constructor(source: BancontactSourceType) {
        super("bancontact");
        this.payment_country = source.payment_country;
        this.account_holder_name = source.account_holder_name;
        this.billing_descriptor = source.billing_descriptor;
    }
}

export class EpsSource extends BaseSource {
    public purpose: string;
    public bic?: string;

    public constructor(source: EpsSourceType) {
        super("eps");
        this.purpose = source.purpose;
        this.bic = source.bic;
    }
}

export class FawrySource extends BaseSource {
    public description: string;
    public customer_profile_id?: string;
    public customer_email: string;
    public expires_on?: string;
    public products: FawryProduct[];

    public constructor(source: FawrySourceType) {
        super("fawry");
        this.description = source.description;
        this.customer_profile_id = source.customer_profile_id;
        this.customer_email = source.customer_email;
        this.expires_on = source.expires_on;
        this.products = source.products;
    }
}

export class KlarnaSource extends BaseSource {
    public authorization_token: string;
    public locale: string;
    public purchase_country: string;
    public auto_capture?: boolean;
    public billing_address: KlarnaAddress;
    public shipping_address?: KlarnaAddress;
    public tax_amount: number;
    public products: KlarnaProduct[];
    public customer?: KlarnaCustomer;
    public merchant_reference1?: string;
    public merchant_reference2?: string;
    public merchant_data?: string;
    public attachment?: any;

    public constructor(source: KlarnaSourceType) {
        super("klarna");
        this.authorization_token = source.authorization_token;
        this.locale = source.locale;
        this.purchase_country = source.purchase_country;
        this.auto_capture = this.auto_capture;
        this.billing_address = source.billing_address;
        this.shipping_address = source.shipping_address;
        this.tax_amount = source.tax_amount;
        this.products = source.products;
        this.customer = source.customer;
        this.merchant_reference1 = source.merchant_reference1;
        this.merchant_reference2 = source.merchant_reference2;
        this.merchant_data = source.merchant_data;
        this.attachment = source.attachment;
    }
}

export class GiropaySource extends BaseSource {
    public purpose: string;
    public bic?: string;
    public iban?: string;
    public info_fields?: InfoFields;

    public constructor(source: GiropaySourceType) {
        super("giropay");
        this.purpose = source.purpose;
        this.bic = source.bic;
        this.iban = source.iban;
        this.info_fields = source.info_fields;
    }
}

export class IdealSource extends BaseSource {
    public description: string;
    public bic: string;
    public language?: string;

    public constructor(source: IdealSourceType) {
        super("ideal");
        this.description = source.description;
        this.bic = source.bic;
        this.language = source.language;
    }
}

export class KnetSource extends BaseSource {
    public language: KnetLanguage;
    public user_defined_field1?: string;
    public user_defined_field2?: string;
    public user_defined_field3?: string;
    public user_defined_field4?: string;
    public user_defined_field5?: string;
    public card_token?: string;
    public ptlf?: string;

    public constructor(source: KnetSourceType) {
        super("knet");
        this.language = source.language;
        this.user_defined_field1 = source.user_defined_field1;
        this.user_defined_field2 = source.user_defined_field2;
        this.user_defined_field3 = source.user_defined_field3;
        this.user_defined_field4 = source.user_defined_field4;
        this.user_defined_field5 = source.user_defined_field5;
        this.card_token = source.card_token;
        this.ptlf = source.ptlf;
    }
}

export class QpaySource extends BaseSource {
    public quantity?: number;
    public description: string;
    public language?: string;
    public national_id?: string;

    public constructor(source: QpaySourceType) {
        super("qpay");
        this.quantity = source.quantity;
        this.description = source.description;
        this.language = source.language;
        this.national_id = source.national_id;
    }
}

export class PoliSource extends BaseSource {
    public constructor() {
        super("poli");
    }
}

export class SofortSource extends BaseSource {
    public constructor() {
        super("sofort");
    }
}

