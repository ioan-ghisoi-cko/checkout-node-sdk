// import the SDK
import { Checkout, CardSource } from "../src";

describe("Playground:\n", async () => {
  it("runs your code", async () => {
    ////////////////////////PLAYGROUND AREA/////////////////////////

    // initialise the SDK
    const cko = new Checkout("sk_test_43ed9a7f-4799-461d-b201-a70507878b51");

    const transaction = await cko.payments.request<CardSource>({
      source: new CardSource({
        number: "4242424242424242",
        expiry_month: 6,
        expiry_year: 2029,
        cvv: "100"
      }),
      currency: "GBP",
      amount: 113
    });

    console.log(`The Payment id is: ${transaction.id}`);
    console.log(`Is the payment completed? ->  ${transaction.isCompleted()}`);
    console.log(`Is the payment flagged? ->  ${transaction.isFlagged()}`);
    console.log(`Does the payment require a redirection ? ->  ${transaction.requiresRedirect()}`);

    ////////////////////////PLAYGROUND AREA/////////////////////////
  });
});