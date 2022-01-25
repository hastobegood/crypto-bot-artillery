import { TickerClient } from '../domain/ticker-client.js';
import { ExchangeTickerClient } from './exchanges/exchange-ticker-client.js';
import { FetchTicker, Ticker, TickerExchange } from '../domain/model/ticker.js';

export class HttpTickerClient implements TickerClient {
  constructor(private exchangeTickerClients: ExchangeTickerClient[]) {}

  async fetch(fetchTicker: FetchTicker): Promise<Ticker> {
    return this.#getExchangeTickerClient(fetchTicker.exchange).fetchTicker(fetchTicker);
  }

  #getExchangeTickerClient(exchange: TickerExchange): ExchangeTickerClient {
    const exchangeTickerClient = this.exchangeTickerClients.find((exchangeTickerClient) => exchangeTickerClient.getExchange() === exchange);
    if (!exchangeTickerClient) {
      throw new Error(`Unsupported '${exchange}' exchange`);
    }
    return exchangeTickerClient;
  }
}
