import { Checkout } from "johnny-tools-node";

const cko = new Checkout("sk_test_3e1ad21b-ac23-4eb3-ad1f-375e9fb56481");

(async () => {
  const transaction = await cko.payments.request({
    source: {
      type: "card",
      number: "4242424242424242",
      expiry_month: 6,
      expiry_year: 2029,
      cvv: "100"
    },
    currency: "USD",
    amount: 100
  });

  console.log(transaction.status);
})();
