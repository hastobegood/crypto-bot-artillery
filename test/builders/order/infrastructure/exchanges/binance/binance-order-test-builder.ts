import { GetAccountTradesListOutput, GetAccountTradesListOutputSymbol, GetOrderOutput, SendOrderOutput, SendOrderOutputFill } from '@hastobegood/crypto-clients-binance';

import { randomAsset, randomBoolean, randomFromList, randomNumber, randomString, randomSymbol } from '../../../../random-test-builder.js';

export const buildDefaultBinanceSendOrderOutput = (): SendOrderOutput => {
  return {
    symbol: randomSymbol(),
    orderId: randomNumber(),
    orderListId: -1,
    clientOrderId: randomString(),
    transactTime: new Date().valueOf(),
    price: randomNumber(10, 100).toString(),
    origQty: randomNumber(10, 100).toString(),
    executedQty: randomNumber(10, 100).toString(),
    cummulativeQuoteQty: randomNumber(10, 100).toString(),
    status: randomFromList(['NEW', 'PARTIALLY_FILLED', 'FILLED', 'CANCELED', 'PENDING_CANCEL', 'REJECTED', 'EXPIRED']),
    timeInForce: randomFromList(['GTC', 'IOC', 'FOK']),
    type: randomFromList(['MARKET', 'LIMIT']),
    side: randomFromList(['BUY', 'SELL']),
    fills: [buildDefaultBinanceSendOrderOutputFill(), buildDefaultBinanceSendOrderOutputFill()],
  };
};

export const buildDefaultBinanceSendOrderOutputFill = (): SendOrderOutputFill => {
  return {
    price: randomNumber(1, 1_000).toString(),
    qty: randomNumber(10, 100).toString(),
    commission: randomNumber(1, 10).toString(),
    commissionAsset: randomAsset(),
    tradeId: randomNumber(),
  };
};

export const buildDefaultBinanceGetOrderOutput = (): GetOrderOutput => {
  return {
    symbol: randomSymbol(),
    orderId: randomNumber(),
    orderListId: -1,
    clientOrderId: randomString(),
    price: randomNumber(10, 100).toString(),
    origQty: randomNumber(10, 100).toString(),
    executedQty: randomNumber(10, 100).toString(),
    cummulativeQuoteQty: randomNumber(10, 100).toString(),
    status: randomFromList(['NEW', 'PARTIALLY_FILLED', 'FILLED', 'CANCELED', 'PENDING_CANCEL', 'REJECTED', 'EXPIRED']),
    timeInForce: randomFromList(['GTC', 'IOC', 'FOK']),
    type: randomFromList(['MARKET', 'LIMIT']),
    side: randomFromList(['BUY', 'SELL']),
    stopPrice: randomNumber(10, 100).toString(),
    icebergQty: randomNumber(10, 100).toString(),
    time: new Date().valueOf(),
    updateTime: new Date().valueOf(),
    isWorking: randomBoolean(),
    origQuoteOrderQty: randomNumber(10, 100).toString(),
  };
};

export const buildDefaultBinanceGetAccountTradesListOutput = (): GetAccountTradesListOutput => {
  return [buildDefaultBinanceGetAccountTradesListOutputSymbol(), buildDefaultBinanceGetAccountTradesListOutputSymbol()];
};

export const buildDefaultBinanceGetAccountTradesListOutputSymbol = (): GetAccountTradesListOutputSymbol => {
  return {
    symbol: randomSymbol(),
    id: randomNumber(),
    orderId: randomNumber(),
    orderListId: randomNumber(),
    price: randomNumber(0.01, 1_000).toString(),
    qty: randomNumber(1, 100_000).toString(),
    quoteQty: randomNumber(1, 100_000).toString(),
    commission: randomNumber(1, 100_000).toString(),
    commissionAsset: randomAsset(),
    time: new Date().valueOf(),
    isBuyer: randomBoolean(),
    isMaker: randomBoolean(),
    isBestMatch: randomBoolean(),
  };
};
