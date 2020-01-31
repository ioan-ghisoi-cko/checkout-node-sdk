import { Checkout } from "./types";

const f = new Checkout("sk");
console.log(f);

f.payments.capture("pay_12312312");
