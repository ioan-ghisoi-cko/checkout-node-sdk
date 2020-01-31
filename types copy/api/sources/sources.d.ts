import { config } from "../../Checkout";
export default class Sources {
  constructor(config: config);

  add: (body: any) => Promise<any>;
}
