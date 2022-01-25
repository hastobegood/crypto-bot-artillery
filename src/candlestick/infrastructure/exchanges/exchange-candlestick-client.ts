import { CandlestickExchange, Candlesticks, FetchAllCandlesticks } from '../../../../src/candlestick/domain/model/candlestick.js';

export interface ExchangeCandlestickClient {
  getExchange(): CandlestickExchange;

  fetchAllCandlesticks(fetchAllCandlesticks: FetchAllCandlesticks): Promise<Candlesticks>;
}
