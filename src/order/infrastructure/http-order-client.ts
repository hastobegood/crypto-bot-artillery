import { CheckOrder, Order, OrderCheckup, OrderExchange, TransientOrder } from '../domain/model/order.js';
import { OrderClient } from '../domain/order-client.js';

import { ExchangeOrderClient } from './exchanges/exchange-order-client.js';

export class HttpOrderClient implements OrderClient {
  constructor(private exchangeOrderClients: ExchangeOrderClient[]) {}

  async send(transientOrder: TransientOrder): Promise<Order> {
    return this.#getExchangeOrderClient(transientOrder.exchange).sendOrder(transientOrder);
  }

  async check(checkOrder: CheckOrder): Promise<OrderCheckup> {
    return this.#getExchangeOrderClient(checkOrder.exchange).checkOrder(checkOrder);
  }

  #getExchangeOrderClient(exchange: OrderExchange): ExchangeOrderClient {
    const exchangeOrderClient = this.exchangeOrderClients.find((exchangeOrderClient) => exchangeOrderClient.getExchange() === exchange);
    if (!exchangeOrderClient) {
      throw new Error(`Unsupported '${exchange}' exchange`);
    }
    return exchangeOrderClient;
  }
}
