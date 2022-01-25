import { CheckOrder, OrderCheckup } from './model/order.js';
import { OrderClient } from './order-client.js';

export class CheckOrderClient {
  constructor(private orderClient: OrderClient) {}

  async check(checkOrder: CheckOrder): Promise<OrderCheckup> {
    return this.orderClient.check(checkOrder);
  }
}
