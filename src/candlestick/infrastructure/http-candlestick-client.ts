import { CandlestickClient } from '../domain/candlestick-client.js';
import { ExchangeCandlestickClient } from './exchanges/exchange-candlestick-client.js';
import { CandlestickExchange, Candlesticks, FetchAllCandlesticks } from '../domain/model/candlestick.js';

export class HttpCandlestickClient implements CandlestickClient {
  constructor(private exchangeCandlestickClients: ExchangeCandlestickClient[]) {}

  async fetchAll(fetchAllCandlesticks: FetchAllCandlesticks): Promise<Candlesticks> {
    return this.#getExchangeCandlestickClient(fetchAllCandlesticks.exchange).fetchAllCandlesticks(fetchAllCandlesticks);
  }

  #getExchangeCandlestickClient(exchange: CandlestickExchange): ExchangeCandlestickClient {
    const exchangeCandlestickClient = this.exchangeCandlestickClients.find((exchangeCandlestickClient) => exchangeCandlestickClient.getExchange() === exchange);
    if (!exchangeCandlestickClient) {
      throw new Error(`Unsupported '${exchange}' exchange`);
    }
    return exchangeCandlestickClient;
  }
}
