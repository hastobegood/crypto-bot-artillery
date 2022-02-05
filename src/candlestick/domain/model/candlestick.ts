export type CandlestickExchange = 'Binance';
export type CandlestickInterval = '1m' | '5m' | '15m' | '30m' | '1h' | '6h' | '12h' | '1d';

export interface FetchAllCandlesticks {
  exchange: CandlestickExchange;
  symbol: string;
  interval: CandlestickInterval;
  period: number;
  startDate?: number;
  endDate?: number;
}

export interface Candlesticks extends FetchAllCandlesticks {
  values: Candlestick[];
}

export interface Candlestick {
  openingDate: number;
  closingDate: number;
  openingPrice: number;
  closingPrice: number;
  lowestPrice: number;
  highestPrice: number;
  volume: number;
}
