import { MemoryCache } from '../../common/cache/memory-cache';

import { FetchTicker, Ticker } from './model/ticker.js';
import { TickerClient } from './ticker-client.js';

export class FetchTickerClient {
  private readonly cache?: MemoryCache<Ticker>;

  constructor(private tickerClient: TickerClient, ttl?: number) {
    if (ttl !== undefined) {
      this.cache = new MemoryCache(ttl);
    }
  }

  async fetch(fetchTicker: FetchTicker): Promise<Ticker> {
    if (this.cache) {
      const cacheKey = `${fetchTicker.exchange}/${fetchTicker.symbol}`;
      const cacheSource = (): Promise<Ticker> => this.tickerClient.fetch(fetchTicker);
      return this.cache.getAndSet(cacheKey, cacheSource);
    }

    return this.tickerClient.fetch(fetchTicker);
  }
}
