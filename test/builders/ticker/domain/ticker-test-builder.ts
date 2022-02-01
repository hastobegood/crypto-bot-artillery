import { randomFromList, randomNumber, randomSymbol } from '../../random-test-builder.js';
import { FetchTicker, Ticker } from '../../../../src/ticker/domain/model/ticker.js';

export const buildDefaultFetchTicker = (): FetchTicker => {
  return {
    exchange: randomFromList(['Binance']),
    symbol: randomSymbol(),
  };
};

export const buildDefaultTicker = (): Ticker => {
  return {
    exchange: randomFromList(['Binance']),
    symbol: randomSymbol(),
    baseAssetPrecision: randomNumber(8, 10),
    quoteAssetPrecision: randomNumber(8, 10),
    quantityPrecision: randomNumber(2, 6),
    quantityInterval: randomNumber(0.01, 0.000001),
    pricePrecision: randomNumber(2, 6),
    priceInterval: randomNumber(0.01, 0.000001),
  };
};
