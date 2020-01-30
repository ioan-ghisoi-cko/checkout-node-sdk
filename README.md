![Status](https://img.shields.io/badge/status-ALPHA-red.svg)

# checkout-node-sdk

[![codecov](https://codecov.io/gh/ioan-ghisoi-cko/checkout-node-sdk/branch/remake/graph/badge.svg)](https://codecov.io/gh/ioan-ghisoi-cko/checkout-node-sdk)
[![Build Status](https://travis-ci.org/ioan-ghisoi-cko/checkout-node-sdk.svg?branch=remake)](https://travis-ci.org/ioan-ghisoi-cko/checkout-node-sdk)
[![codebeat badge](https://codebeat.co/badges/b41734ff-7fb5-4867-94d3-ab0729bb6b69)](https://codebeat.co/projects/github-com-ioan-ghisoi-cko-checkout-node-sdk-remake)

# Import

```js
import import { Checkout } from "{soon_on_npm}";
```

# Initialise

> Picks up your environment variables set as **CKO_SECRET_KEY** and **CKO_PUBLIC_KEY**

```js
const cko = new Checkout();
```

> With your secret key.

```js
const cko = new Checkout("sk_XXXX");
```

> With your secret key and custom config

```js
const cko = new Checkout("sk_XXXX", { timeout: 7000 });
```

# Environment

> Unless you specify the host, the SDK will determine the environemnt based on your secret key

```js
const cko = new Checkout('sk_XXXX', { host:'test.com' }); => custom host
const cko = new Checkout('sk_XXXX'); => Live Environemnt
const cko = new Checkout('sk_test_XXXX'); => Sandbox Environemnt
```

> In case you use the token endpoint you can set you publick key like this:

```js
const cko = new Checkout("sk_XXXX", { pk: "pk_XXX" });
// or cko.config.pk = "pk_XXX"
```

# Payments

The SDK will infer the `type` of the payment `source` or `destination`, if not provided, for: `token`, `id`, `card`, `customer`, `network_token`

> The request body is dynamic so if you want to see the paramenters check [the docs](https://api-reference.checkout.com/#tag/Payments)

### Request a payment or a payout

#### Source Type: `token`

```js
const payment = await cko.payments.request({
  source: {
    token: "tok_bzi43qc6jeee5mmnfo4gnsnera"
  },
  currency: "USD",
  amount: 1000 // cents
});
```

#### Source Type: `card`

```js
const payment = await cko.payments.request({
  source: {
    number: "4242424242424242",
    expiry_month: 6,
    expiry_year: 2029,
    cvv: "100"
  },
  currency: "USD",
  amount: 1000 // cents
});
```

#### Source Type: `id`

```js
const payment = await cko.payments.request({
  source: {
    id: "src_vg3tm54ndfbefotjlmgrrvbxli"
  },
  currency: "USD",
  amount: 1000 // cents
});
```

#### Source Type: `customer`

```js
const payment = await cko.payments.request({
  source: {
    id: "cus_6artgoevd77u7ojah2wled32sa"
  },
  currency: "USD",
  amount: 1000 // cents
});
```

#### Source Type: Alternative Payment Method (APM)

```js
const payment = await cko.payments.request({
  source: {
    type: "sofort"
  },
  currency: "EUR",
  amount: 1000 // cents
});
```

#### Destination Type: `id`

```js
const payment = await cko.payments.request({
  destination: {
    id: "src_vg3tm54ndfbefotjlmgrrvbxli"
  },
  currency: "USD",
  amount: 1000 // cents
});
```

### Get payment details

#### With: `payment id`

```js
const payment = await cko.payments.get("pay_je5hbbb4u3oe7k4u3lbwlu3zkq");
```

#### With: `session id`

```js
const payment = await cko.payments.get("sid_pm6woylsb23efp37npxgmml4ti");
```

### Get payment actions

#### With: `payment id`

```js
const payment = await cko.payments.getActions("pay_je5hbbb4u3oe7k4u3lbwlu3zkq");
```

### Payment flow

#### Perform: `Capture` `Void` `Refund`

```js
const capture = await cko.payments.capture("pay_je5hbbb4u3oe7k4u3lbwlu3zkq", {
  reference: "capture"
});
const void = await cko.payments.void("pay_je5hbbb4u3oe7k4u3lbwlu3zkq", {
  reference: "void"
});
const refund = await cko.payments.refund("pay_je5hbbb4u3oe7k4u3lbwlu3zkq", {
  reference: "refund"
});
```

### 3DS Support

#### Payment Request Example

```js
const payment = await cko.payments.request({
  source: {
    number: "4242424242424242",
    expiry_month: 6,
    expiry_year: 2029,
    cvv: "100"
  },
  "3ds": {
    enabled: true
  },
  currency: "USD",
  amount: 1000 // cents
});

if (payment.requiresRedirect) {
  let redirectionUrl = payment._links.redirect.href; // will soon be changed to payment.redirectionUrl
  // redirect to the redirectionUrl
}
```

### Exception handling

#### Example

```js
try {
  const payment = await cko.payments.request({
  source: {
    id: "src_vg3tm54ndfbefotjlmgrrvbxli"
  },
  currency: "USD",
  amount: 1000 // cents
  });
} catch (e) {
    switch (err.name) {
        case "ApiTimeout": ...
          break;
        case "AuthenticationError": ...
          break;
        case "ActionNotAllowed": ...
          break;
        case "UrlAlreadyRegistered": ...
          break;
        case "NotFoundError": ...
          break;
        case "UnprocessableError": ...
          break;
        case "ErrorWithBody": ...
          break;
        case "ValidationError": ...
          break;
        case "TooManyRequestsError": ...
          break;
        case "BadGateway": ...
          break;
        case "ValueError": ...
          break;
        default:
          break;
      }
}
```
