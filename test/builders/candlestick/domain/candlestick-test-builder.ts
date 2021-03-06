import { Candlestick, Candlesticks, FetchAllCandlesticks } from '../../../../src/candlestick/domain/model/candlestick.js';
import { randomFromList, randomNumber, randomSymbol } from '../../random-test-builder.js';

export const buildDefaultFetchAllCandlesticks = (): FetchAllCandlesticks => {
  return {
    exchange: randomFromList(['Binance']),
    symbol: randomSymbol(),
    interval: randomFromList(['1m', '5m', '15m', '30m', '1h', '6h', '12h', '1d']),
    period: randomNumber(),
    startDate: randomNumber(),
    endDate: randomNumber(),
  };
};

export const buildDefaultCandlesticks = (): Candlesticks => {
  return {
    ...buildDefaultFetchAllCandlesticks(),
    values: [buildDefaultCandlestick(), buildDefaultCandlestick(), buildDefaultCandlestick()],
  };
};

export const buildDefaultCandlestick = (): Candlestick => {
  return {
    openingDate: new Date().valueOf(),
    closingDate: new Date().valueOf(),
    openingPrice: randomNumber(1_000, 100_000),
    closingPrice: randomNumber(1_000, 100_000),
    lowestPrice: randomNumber(1_000, 100_000),
    highestPrice: randomNumber(1_000, 100_000),
    volume: randomNumber(10_000, 100_000),
  };
};

export const buildCandlesticksFromTo = (openingDate: Date, closingDate: Date, stepSeconds: number): Candlestick[] => {
  const end = closingDate.valueOf();
  let current = openingDate.valueOf();
  let openingPrice = randomNumber(400, 500);
  let closingPrice = randomNumber(400, 500);
  let lowestPrice = randomNumber(350, 400);
  let highestPrice = randomNumber(500, 550);
  let volume = randomNumber(10_000, 100_000);

  const results: Candlestick[] = [];
  do {
    results.push({
      openingDate: current,
      closingDate: current + stepSeconds * 1_000 - 1,
      openingPrice: openingPrice,
      closingPrice: closingPrice,
      lowestPrice: lowestPrice,
      highestPrice: highestPrice,
      volume: volume,
    });
    current += stepSeconds * 1_000;
    openingPrice = closingPrice;
    closingPrice = randomNumber(400, 500);
    lowestPrice = randomNumber(350, 400);
    highestPrice = randomNumber(500, 550);
    volume = randomNumber(10_000, 100_000);
  } while (current <= end);

  return results;
};
