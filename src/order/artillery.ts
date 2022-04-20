import { ExchangesClients } from '../common/exchanges/clients.js';
import { FetchTickerClient } from '../ticker/domain/fetch-ticker-client.js';

import { CheckOrderClient } from './domain/check-order-client.js';
import { OrderClient } from './domain/order-client.js';
import { SendOrderClient } from './domain/send-order-client.js';
import { BinanceOrderClient } from './infrastructure/exchanges/binance/binance-order-client.js';
import { ExchangeOrderClient } from './infrastructure/exchanges/exchange-order-client.js';
import { HttpOrderClient } from './infrastructure/http-order-client.js';

let orderClient: OrderClient;

const loadOrderClient = (exchangesClients: ExchangesClients): OrderClient => {
  if (!orderClient) {
    const orderClients: ExchangeOrderClient[] = [];
    if (exchangesClients.binanceClient) {
      orderClients.push(new BinanceOrderClient(exchangesClients.binanceClient));
    }
    orderClient = new HttpOrderClient(orderClients);
  }
  return orderClient;
};

export const loadSendOrderClient = (exchangesClients: ExchangesClients, fetchTickerClient: FetchTickerClient): SendOrderClient => {
  return new SendOrderClient(fetchTickerClient, loadOrderClient(exchangesClients));
};

export const loadCheckOrderClient = (exchangesClients: ExchangesClients): CheckOrderClient => {
  return new CheckOrderClient(loadOrderClient(exchangesClients));
};
