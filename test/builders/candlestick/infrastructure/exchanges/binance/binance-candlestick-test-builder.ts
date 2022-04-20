import { GetCandlestickDataOutput } from '@hastobegood/crypto-clients-binance';

import { randomNumber } from '../../../../random-test-builder.js';

export const buildDefaultBinanceGetCandlestickDataOutput = (): GetCandlestickDataOutput => {
  return [1, 2, 3, 4, 5].map(() => [
    new Date().valueOf(),
    randomNumber().toString(),
    randomNumber().toString(),
    randomNumber().toString(),
    randomNumber().toString(),
    randomNumber().toString(),
    new Date().valueOf(),
    randomNumber().toString(),
    randomNumber(1, 1_000),
    randomNumber().toString(),
    randomNumber().toString(),
    randomNumber().toString(),
  ]);
};
