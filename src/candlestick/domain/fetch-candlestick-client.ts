import { CandlestickClient } from './candlestick-client.js';
import { Candlesticks, FetchAllCandlesticks } from './model/candlestick.js';

export class FetchCandlestickClient {
  constructor(private candlestickClient: CandlestickClient) {}

  async fetchAll(fetchAllCandlesticks: FetchAllCandlesticks): Promise<Candlesticks> {
    return this.candlestickClient.fetchAll(fetchAllCandlesticks);
  }
}
