import { Checkout } from "./src/index";

const f = new Checkout("sk");
f.payments.request();

f.payments.capture("pay_12312312");
