import MockDate from 'mockdate';
import { truncateNumber } from '../../../../src/common/util/math.js';
import { FetchTickerClient } from '../../../../src/ticker/domain/fetch-ticker-client.js';
import { Ticker } from '../../../../src/ticker/domain/model/ticker.js';
import { OrderClient } from '../../../../src/order/domain/order-client.js';
import { SendOrderClient } from '../../../../src/order/domain/send-order-client.js';
import { Order, SendOrder } from '../../../../src/order/domain/model/order.js';
import { buildDefaultTicker } from '../../../builders/ticker/domain/ticker-test-builder.js';
import { buildDefaultLimitOrder, buildDefaultMarketOrder, buildDefaultSendLimitOrder, buildDefaultSendMarketOrder } from '../../../builders/order/domain/order-test-builder.js';

const fetchTickerClientMock = jest.mocked(jest.genMockFromModule<FetchTickerClient>('../../../../src/ticker/domain/fetch-ticker-client.js'), true);
const orderClientMock = jest.mocked(jest.genMockFromModule<OrderClient>('../../../../src/order/domain/order-client.js'), true);

let sendOrderClient: SendOrderClient;
beforeEach(() => {
  fetchTickerClientMock.fetch = jest.fn();
  orderClientMock.send = jest.fn();

  sendOrderClient = new SendOrderClient(fetchTickerClientMock, orderClientMock);
});

describe('SendOrderClient', () => {
  let creationDate: Date;
  let sendOrder: SendOrder;
  let ticker: Ticker;
  let order: Order;

  beforeEach(() => {
    creationDate = new Date();
    MockDate.set(creationDate);

    ticker = buildDefaultTicker();
    fetchTickerClientMock.fetch.mockResolvedValue(ticker);
  });

  describe('Given a market order to send', () => {
    beforeEach(() => {
      sendOrder = buildDefaultSendMarketOrder();
    });

    describe('When order is sent with price limit', () => {
      beforeEach(() => {
        sendOrder.requestedPrice = 10;
      });

      it('Then error is thrown', async () => {
        try {
          await sendOrderClient.send(sendOrder);
          fail();
        } catch (error) {
          expect((error as Error).message).toEqual('Unable to send a market order with price limit');
        }

        expect(fetchTickerClientMock.fetch).toHaveBeenCalledTimes(0);
        expect(orderClientMock.send).toHaveBeenCalledTimes(0);
      });
    });

    describe('When order is sent with quote quantity', () => {
      beforeEach(() => {
        sendOrder.quote = true;

        order = buildDefaultMarketOrder();
        orderClientMock.send.mockResolvedValue(order);
      });

      it('Then order is returned', async () => {
        const result = await sendOrderClient.send(sendOrder);
        expect(result).toEqual(order);

        expect(fetchTickerClientMock.fetch).toHaveBeenCalledTimes(1);
        const fetchBySymbolParams = fetchTickerClientMock.fetch.mock.calls[0];
        expect(fetchBySymbolParams.length).toEqual(1);
        expect(fetchBySymbolParams[0]).toEqual({
          exchange: sendOrder.exchange,
          symbol: sendOrder.symbol,
        });

        expect(orderClientMock.send).toHaveBeenCalledTimes(1);
        const sendParams = orderClientMock.send.mock.calls[0];
        expect(sendParams.length).toEqual(1);
        expect(sendParams[0]).toEqual({
          ...sendOrder,
          id: expect.stringMatching('.*'),
          requestedQuantity: truncateNumber(sendOrder.requestedQuantity, ticker.quoteAssetPrecision),
          creationDate: creationDate,
        });
      });
    });

    describe('When order is sent with base quantity', () => {
      beforeEach(() => {
        sendOrder.quote = false;

        order = buildDefaultMarketOrder();
        orderClientMock.send.mockResolvedValue(order);
      });

      it('Then order is returned', async () => {
        const result = await sendOrderClient.send(sendOrder);
        expect(result).toEqual(order);

        expect(fetchTickerClientMock.fetch).toHaveBeenCalledTimes(1);
        const fetchBySymbolParams = fetchTickerClientMock.fetch.mock.calls[0];
        expect(fetchBySymbolParams.length).toEqual(1);
        expect(fetchBySymbolParams[0]).toEqual({
          exchange: sendOrder.exchange,
          symbol: sendOrder.symbol,
        });

        expect(orderClientMock.send).toHaveBeenCalledTimes(1);
        const sendParams = orderClientMock.send.mock.calls[0];
        expect(sendParams.length).toEqual(1);
        expect(sendParams[0]).toEqual({
          ...sendOrder,
          id: expect.stringMatching('.*'),
          requestedQuantity: truncateNumber(sendOrder.requestedQuantity, ticker.quantityPrecision),
          creationDate: creationDate,
        });
      });
    });
  });

  describe('Given a limit order to send', () => {
    beforeEach(() => {
      sendOrder = buildDefaultSendLimitOrder();
    });

    describe('When order is sent without price limit', () => {
      beforeEach(() => {
        sendOrder.requestedPrice = undefined;
      });

      it('Then error is thrown', async () => {
        try {
          await sendOrderClient.send(sendOrder);
          fail();
        } catch (error) {
          expect((error as Error).message).toEqual('Unable to send a limit order without price limit');
        }

        expect(fetchTickerClientMock.fetch).toHaveBeenCalledTimes(0);
        expect(orderClientMock.send).toHaveBeenCalledTimes(0);
      });
    });

    describe('When order is sent with quote quantity', () => {
      beforeEach(() => {
        sendOrder.quote = true;
      });

      it('Then error is thrown', async () => {
        try {
          await sendOrderClient.send(sendOrder);
          fail();
        } catch (error) {
          expect((error as Error).message).toEqual('Unable to send a limit order using quote asset quantity');
        }

        expect(fetchTickerClientMock.fetch).toHaveBeenCalledTimes(0);
        expect(orderClientMock.send).toHaveBeenCalledTimes(0);
      });
    });

    describe('When order is sent with base quantity', () => {
      beforeEach(() => {
        sendOrder.quote = false;

        order = buildDefaultLimitOrder();
        orderClientMock.send.mockResolvedValue(order);
      });

      it('Then created order is returned', async () => {
        const result = await sendOrderClient.send(sendOrder);
        expect(result).toEqual(order);

        expect(fetchTickerClientMock.fetch).toHaveBeenCalledTimes(1);
        const fetchBySymbolParams = fetchTickerClientMock.fetch.mock.calls[0];
        expect(fetchBySymbolParams.length).toEqual(1);
        expect(fetchBySymbolParams[0]).toEqual({
          exchange: sendOrder.exchange,
          symbol: sendOrder.symbol,
        });

        expect(orderClientMock.send).toHaveBeenCalledTimes(1);
        const sendParams = orderClientMock.send.mock.calls[0];
        expect(sendParams.length).toEqual(1);
        expect(sendParams[0]).toEqual({
          ...sendOrder,
          id: expect.stringMatching('.*'),
          requestedQuantity: truncateNumber(sendOrder.requestedQuantity, ticker.quantityPrecision),
          requestedPrice: truncateNumber(sendOrder.requestedPrice!, ticker.pricePrecision),
          creationDate: creationDate,
        });
      });
    });
  });
});
