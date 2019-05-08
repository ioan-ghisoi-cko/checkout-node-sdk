import { Address, Phone, NetworkTokenType, InfoFields } from './types';

// export class TokenSource {
//     private readonly type: string = 'token';
//     public token: string;
//     public billing_address?: Address;
//     public phone?: Phone

//     public constructor(
//         {
//             token,
//             billing_address,
//             phone }:
//             {
//                 token: string,
//                 billing_address?: Address,
//                 phone?: Phone
//             }) {
//         this.token = token;
//         this.billing_address = billing_address;
//         this.phone = phone;
//     }
// }

// export class IdSource {
//     private readonly type: string = 'id';
//     public id: string;
//     public cvv?: string;

//     public constructor(
//         {
//             id,
//             cvv
//         }:
//             {
//                 id: string,
//                 cvv?: string
//             }) {
//         this.id = id;
//         this.cvv = cvv;
//     }
// }

export class CardSource {
    private readonly type: string = 'card';
    public number: string;
    public expiry_month: string;
    public expiry_year: string;
    public name?: string;
    public cvv?: string;
    public stored?: boolean;
    public billing_address?: Address;
    public phone?: Phone;

    public constructor(
        {
            number,
            expiry_month,
            expiry_year,
            name,
            cvv,
            stored,
            billing_address,
            phone }:
            {
                number: string,
                expiry_month: string,
                expiry_year: string,
                name?: string,
                cvv?: string,
                stored?: boolean,
                billing_address?: Address,
                phone?: Phone
            }) {
        this.number = number;
        this.expiry_month = expiry_month;
        this.expiry_year = expiry_year;
        this.name = name;
        this.cvv = cvv;
        this.stored = stored;
        this.billing_address = billing_address;
        this.phone = phone;
    }
}

// export class CustomerSource {
//     private readonly type: string = 'customer';
//     public id?: string;
//     public email?: string;

//     public constructor({ id, email }: { id?: string, email?: string }) {
//         this.id = id;
//         this.email = email;
//     }
// }

// export class NetworkTokenSource {
//     private readonly type: string = 'network_token';
//     public token: string;
//     public expiry_month: number;
//     public expiry_year: number;
//     public token_type: NetworkTokenType;
//     public cryptogram: string;
//     public eci: string;
//     public stored?: string;
//     public name?: string;
//     public cvv?: string;
//     public billing_address?: Address;
//     public phone?: Phone;

//     public constructor(
//         {
//             token,
//             expiry_month,
//             expiry_year,
//             token_type,
//             cryptogram,
//             eci,
//             stored,
//             name,
//             cvv,
//             billing_address,
//             phone
//         }: {
//             token: string,
//             expiry_month: number,
//             expiry_year: number,
//             token_type: NetworkTokenType,
//             cryptogram: string,
//             eci: string,
//             stored?: string,
//             name?: string,
//             cvv?: string,
//             billing_address?: Address,
//             phone?: Phone
//         }) {
//         this.token = token;
//         this.expiry_month = expiry_month;
//         this.expiry_year = expiry_year;
//         this.token_type = token_type;
//         this.cryptogram = cryptogram;
//         this.eci = eci;
//         this.stored = stored;
//         this.name = name;
//         this.cvv = cvv;
//         this.billing_address = billing_address;
//         this.phone = phone;
//     }
// }

// export class AlipaySource {
//     private readonly type: string = 'alipay';

//     public constructor() { }
// }

// export class BoletoSource {
//     private readonly type: string = 'boleto';
//     public birthDate: string;
//     public cpf: string;
//     public customerName: string;

//     public constructor(
//         {
//             birthDate,
//             cpf,
//             customerName
//         }: {
//             birthDate: string,
//             cpf: string,
//             customerName: string,
//         }) {
//         this.birthDate = birthDate;
//         this.cpf = cpf;
//         this.customerName = customerName;
//     }
// }

// export class GiropaySource {
//     private readonly type: string = 'giropay';
//     public purpose: string;
//     public bic: string;
//     public iban?: string;
//     public info_fields?: InfoFields;

//     public constructor(
//         {
//             purpose,
//             bic,
//             iban,
//             info_fields
//         }: {
//             purpose: string,
//             bic: string,
//             iban?: string,
//             info_fields?: InfoFields
//         }) {
//         this.purpose = purpose;
//         this.bic = bic;
//         this.iban = iban;
//         this.info_fields = info_fields;
//     }
// }

// export class IdealSource {
//     private readonly type: string = 'ideal';
//     public description: string;
//     public bic: string;
//     public language?: string;

//     public constructor(
//         {
//             description,
//             bic,
//             language,
//         }: {
//             description: string,
//             bic: string,
//             language?: string
//         }) {
//         this.description = description;
//         this.bic = bic;
//         this.language = language;
//     }
// }

// export class KlarnaSource {
//     private readonly type: string = 'klarna';
//     public authorization_token: string;
//     public locale: string;
//     public purchase_country: string;
//     public auto_capture?: boolean;
//     public billing_address: any;
//     public shipping_address?: any;
//     public tax_amount: number;
//     public products: any;
//     public customer?: any;
//     public merchant_reference1?: string;
//     public merchant_reference2?: string;
//     public merchant_data?: any;

//     public constructor(
//         {
//             authorization_token,
//             locale,
//             purchase_country,
//             auto_capture,
//             billing_address,
//             shipping_address,
//             tax_amount,
//             products,
//             customer,
//             merchant_reference1,
//             merchant_reference2,
//             merchant_data,
//         }: {
//             authorization_token: string,
//             locale: string,
//             purchase_country: string,
//             auto_capture?: boolean,
//             billing_address: any,
//             shipping_address?: any,
//             tax_amount: number,
//             products: any,
//             customer?: any,
//             merchant_reference1?: string,
//             merchant_reference2?: string,
//             merchant_data?: any
//         }) {
//         this.authorization_token = authorization_token;
//         this.locale = locale;
//         this.purchase_country = purchase_country;
//         this.auto_capture = auto_capture;
//         this.billing_address = billing_address;
//         this.shipping_address = shipping_address;
//         this.tax_amount = tax_amount;
//         this.products = products;
//         this.customer = customer;
//         this.merchant_reference1 = merchant_reference1;
//         this.merchant_reference2 = merchant_reference2;
//         this.merchant_data = merchant_data;
//     }
// }

// export class PoliSource {
//     private readonly type: string = 'poli';

//     public constructor() { }
// }

// export class QiwiSource {
//     private readonly type: string = 'qiwi';
//     public walletId: string;

//     public constructor({ walletId }: { walletId: string }) {
//         this.walletId = walletId;
//     }
// }

// export class SafetypaySource {
//     private readonly type: string = 'safetypay';

//     public constructor() { }
// }

// export class SofortSource {
//     private readonly type: string = 'sofort';

//     public constructor() { }
// }
