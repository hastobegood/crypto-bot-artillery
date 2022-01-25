import { FetchTicker, Ticker, TickerExchange } from '../../domain/model/ticker.js';

export interface ExchangeTickerClient {
  getExchange(): TickerExchange;

  fetchTicker(fetchTicker: FetchTicker): Promise<Ticker>;
}
