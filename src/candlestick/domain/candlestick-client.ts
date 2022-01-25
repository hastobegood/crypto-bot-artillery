import { Candlesticks, FetchAllCandlesticks } from './model/candlestick.js';

export interface CandlestickClient {
  fetchAll(fetchAllCandlesticks: FetchAllCandlesticks): Promise<Candlesticks>;
}
