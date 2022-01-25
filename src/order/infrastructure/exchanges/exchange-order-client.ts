import { CheckOrder, Order, OrderCheckup, OrderExchange, TransientOrder } from '../../domain/model/order.js';

export interface ExchangeOrderClient {
  getExchange(): OrderExchange;

  sendOrder(transientOrder: TransientOrder): Promise<Order>;

  checkOrder(checkOrder: CheckOrder): Promise<OrderCheckup>;
}
