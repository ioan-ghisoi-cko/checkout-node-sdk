import { config } from "../../Checkout";
export default class Payments {
  constructor(config: config);

  request: (body: any, idempotencyKey?: string) => Promise<any>;
  get: (id: string) => Promise<any>;
  getActions: (id: string) => Promise<any>;
  capture: (paymentId: string, body?: any) => Promise<any>;
  refund: (paymentId: string, body?: any) => Promise<any>;
  void: (paymentId: string, body?: any) => Promise<any>;
}
