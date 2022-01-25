export type TickerExchange = 'Binance';

export interface FetchTicker {
  exchange: TickerExchange;
  symbol: string;
}

export interface Ticker extends FetchTicker {
  baseAssetPrecision: number;
  quoteAssetPrecision: number;
  quantityPrecision: number;
  pricePrecision: number;
}
