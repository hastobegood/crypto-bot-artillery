import { FetchTicker, Ticker } from './model/ticker.js';

export interface TickerClient {
  fetch(fetchTicker: FetchTicker): Promise<Ticker>;
}
