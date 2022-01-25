import { randomBoolean, randomFromList, randomNumber, randomString, randomSymbol } from '../../random-test-builder.js';
import { CheckOrder, Order, OrderCheckup, SendOrder, TransientOrder } from '../../../../src/order/domain/model/order.js';

export const buildDefaultTransientOrder = (): TransientOrder => {
  return buildDefaultTransientMarketOrder();
};

export const buildDefaultTransientMarketOrder = (): TransientOrder => {
  return {
    ...buildDefaultSendMarketOrder(),
    id: randomString(),
    creationDate: new Date(),
  };
};

export const buildDefaultTransientLimitOrder = (): TransientOrder => {
  return {
    ...buildDefaultSendLimitOrder(),
    id: randomString(),
    creationDate: new Date(),
  };
};

export const buildDefaultSendOrder = (): SendOrder => {
  return buildDefaultSendMarketOrder();
};

export const buildDefaultSendMarketOrder = (): SendOrder => {
  return {
    exchange: randomFromList(['Binance']),
    symbol: randomSymbol(),
    side: 'Buy',
    type: 'Market',
    quote: randomBoolean(),
    requestedQuantity: randomNumber(1, 1_000),
  };
};

export const buildDefaultSendLimitOrder = (): SendOrder => {
  return {
    exchange: randomFromList(['Binance']),
    symbol: randomSymbol(),
    side: 'Buy',
    type: 'Limit',
    quote: false,
    requestedQuantity: randomNumber(1, 1_000),
    requestedPrice: randomNumber(1, 1_000),
  };
};

export const buildDefaultOrder = (): Order => {
  return buildDefaultMarketOrder();
};

export const buildDefaultMarketOrder = (): Order => {
  return {
    exchange: randomFromList(['Binance']),
    id: randomString(),
    symbol: randomSymbol(),
    side: 'Buy',
    type: 'Market',
    status: 'Filled',
    creationDate: new Date(),
    quote: randomBoolean(),
    requestedQuantity: randomNumber(100, 1_000),
    transactionDate: new Date(),
    externalId: randomString(),
    externalStatus: 'FILLED',
    executedQuantity: randomNumber(1, 100),
    executedPrice: randomNumber(10, 1_000),
  };
};

export const buildDefaultLimitOrder = (): Order => {
  return {
    exchange: randomFromList(['Binance']),
    id: randomString(),
    symbol: randomSymbol(),
    side: 'Buy',
    type: 'Limit',
    status: 'Filled',
    creationDate: new Date(),
    quote: false,
    requestedQuantity: randomNumber(1, 100),
    requestedPrice: randomNumber(10, 1_000),
    transactionDate: new Date(),
    externalId: randomString(),
    externalStatus: 'FILLED',
    executedQuantity: randomNumber(1, 100),
    executedPrice: randomNumber(10, 1_000),
  };
};

export const buildDefaultCheckOrder = (): CheckOrder => {
  return {
    exchange: randomFromList(['Binance']),
    symbol: randomSymbol(),
    externalId: randomString(),
  };
};

export const buildDefaultOrderCheckup = (): OrderCheckup => {
  return {
    ...buildDefaultCheckOrder(),
    status: randomFromList(['Waiting', 'PartiallyFilled', 'Filled', 'Canceled', 'Error', 'Unknown']),
    externalStatus: randomString(),
    executedQuantity: randomNumber(1, 100),
    executedPrice: randomNumber(10, 1_000),
  };
};
