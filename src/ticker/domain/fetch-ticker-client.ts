import { FetchTicker, Ticker } from './model/ticker.js';
import { TickerClient } from './ticker-client.js';

export class FetchTickerClient {
  constructor(private tickerClient: TickerClient) {}

  async fetch(fetchTicker: FetchTicker): Promise<Ticker> {
    return this.tickerClient.fetch(fetchTicker);
  }
}
