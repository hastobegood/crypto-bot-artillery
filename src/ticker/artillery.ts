import { ExchangesClients } from '../common/exchanges/clients.js';

import { FetchTickerClient } from './domain/fetch-ticker-client.js';
import { TickerClient } from './domain/ticker-client.js';
import { BinanceTickerClient } from './infrastructure/exchanges/binance/binance-ticker-client.js';
import { ExchangeTickerClient } from './infrastructure/exchanges/exchange-ticker-client.js';
import { HttpTickerClient } from './infrastructure/http-ticker-client.js';

let tickerClient: TickerClient;

const loadTickerClient = (exchangesClients: ExchangesClients): TickerClient => {
  if (!tickerClient) {
    const tickerClients: ExchangeTickerClient[] = [];
    if (exchangesClients.binanceClient) {
      tickerClients.push(new BinanceTickerClient(exchangesClients.binanceClient));
    }
    tickerClient = new HttpTickerClient(tickerClients);
  }
  return tickerClient;
};

export const loadFetchTickerClient = (exchangesClients: ExchangesClients, ttl?: number): FetchTickerClient => {
  return new FetchTickerClient(loadTickerClient(exchangesClients), ttl);
};
