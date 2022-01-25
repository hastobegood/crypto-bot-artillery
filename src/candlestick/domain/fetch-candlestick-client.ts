import { Candlesticks, FetchAllCandlesticks } from './model/candlestick.js';
import { CandlestickClient } from './candlestick-client.js';

export class FetchCandlestickClient {
  constructor(private candlestickClient: CandlestickClient) {}

  async fetchAll(fetchAllCandlesticks: FetchAllCandlesticks): Promise<Candlesticks> {
    return this.candlestickClient.fetchAll(fetchAllCandlesticks);
  }
}
