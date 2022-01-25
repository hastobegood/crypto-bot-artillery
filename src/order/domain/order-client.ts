import { CheckOrder, Order, OrderCheckup, TransientOrder } from './model/order.js';

export interface OrderClient {
  send(transientOrder: TransientOrder): Promise<Order>;

  check(checkOrder: CheckOrder): Promise<OrderCheckup>;
}
