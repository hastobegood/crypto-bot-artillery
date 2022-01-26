import { ExchangesClients } from '../common/exchanges/clients.js';
import { BinanceCandlestickClient } from './infrastructure/exchanges/binance/binance-candlestick-client.js';
import { ExchangeCandlestickClient } from './infrastructure/exchanges/exchange-candlestick-client.js';
import { HttpCandlestickClient } from './infrastructure/http-candlestick-client.js';
import { CandlestickClient } from './domain/candlestick-client.js';
import { FetchCandlestickClient } from './domain/fetch-candlestick-client.js';

let candlestickClient: CandlestickClient;

const loadCandlestickClient = (exchangesClients: ExchangesClients): CandlestickClient => {
  if (!candlestickClient) {
    const candlestickClients: ExchangeCandlestickClient[] = [];
    if (exchangesClients.binanceClient) {
      candlestickClients.push(new BinanceCandlestickClient(exchangesClients.binanceClient));
    }
    candlestickClient = new HttpCandlestickClient(candlestickClients);
  }
  return candlestickClient;
};

export const loadFetchCandlestickClient = (exchangesClients: ExchangesClients): FetchCandlestickClient => {
  return new FetchCandlestickClient(loadCandlestickClient(exchangesClients));
};
