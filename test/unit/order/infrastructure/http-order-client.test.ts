import { BinanceOrderClient } from '../../../../src/order/infrastructure/exchanges/binance/binance-order-client.js';
import { HttpOrderClient } from '../../../../src/order/infrastructure/http-order-client.js';
import { CheckOrder, Order, OrderCheckup, OrderExchange, TransientOrder } from '../../../../src/order/domain/model/order.js';
import { buildDefaultCheckOrder, buildDefaultOrder, buildDefaultOrderCheckup, buildDefaultTransientOrder } from '../../../builders/order/domain/order-test-builder.js';

const binanceOrderClientMock = jest.mocked(jest.genMockFromModule<BinanceOrderClient>('../../../../src/order/infrastructure/exchanges/binance/binance-order-client.js'), true);

let orderClient: HttpOrderClient;
beforeEach(() => {
  binanceOrderClientMock.getExchange = jest.fn();
  binanceOrderClientMock.sendOrder = jest.fn();
  binanceOrderClientMock.checkOrder = jest.fn();

  orderClient = new HttpOrderClient([binanceOrderClientMock]);
});

describe('HttpOrderClient', () => {
  beforeEach(() => {
    binanceOrderClientMock.getExchange.mockReturnValue('Binance');
  });

  afterEach(() => {
    expect(binanceOrderClientMock.getExchange).toHaveBeenCalledTimes(1);
    const getExchangeParams = binanceOrderClientMock.getExchange.mock.calls[0];
    expect(getExchangeParams.length).toEqual(0);
  });

  describe('Given an order to send', () => {
    let transientOrder: TransientOrder;

    beforeEach(() => {
      transientOrder = buildDefaultTransientOrder();
    });

    afterEach(() => {
      expect(binanceOrderClientMock.checkOrder).toHaveBeenCalledTimes(0);
    });

    describe('When exchange is unknown', () => {
      beforeEach(() => {
        transientOrder.exchange = 'Unknown' as OrderExchange;
      });

      it('Then error is thrown', async () => {
        try {
          await orderClient.send(transientOrder);
          fail();
        } catch (error) {
          expect((error as Error).message).toEqual("Unsupported 'Unknown' exchange");
        }

        expect(binanceOrderClientMock.sendOrder).toHaveBeenCalledTimes(0);
      });
    });

    describe('When exchange is known', () => {
      let order: Order;

      beforeEach(() => {
        order = buildDefaultOrder();

        binanceOrderClientMock.sendOrder.mockResolvedValueOnce(order);
      });

      it('Then order is returned', async () => {
        const result = await orderClient.send(transientOrder);
        expect(result).toEqual(order);

        expect(binanceOrderClientMock.sendOrder).toHaveBeenCalledTimes(1);
        const sendOrderParams = binanceOrderClientMock.sendOrder.mock.calls[0];
        expect(sendOrderParams.length).toEqual(1);
        expect(sendOrderParams[0]).toEqual(transientOrder);
      });
    });
  });

  describe('Given an order to check', () => {
    let checkOrder: CheckOrder;

    beforeEach(() => {
      checkOrder = buildDefaultCheckOrder();
    });

    afterEach(() => {
      expect(binanceOrderClientMock.sendOrder).toHaveBeenCalledTimes(0);
    });

    describe('When exchange is unknown', () => {
      beforeEach(() => {
        checkOrder.exchange = 'Unknown' as OrderExchange;
      });

      it('Then error is thrown', async () => {
        try {
          await orderClient.check(checkOrder);
          fail();
        } catch (error) {
          expect((error as Error).message).toEqual("Unsupported 'Unknown' exchange");
        }

        expect(binanceOrderClientMock.checkOrder).toHaveBeenCalledTimes(0);
      });
    });

    describe('When exchange is known', () => {
      let orderCheckup: OrderCheckup;

      beforeEach(() => {
        orderCheckup = buildDefaultOrderCheckup();
        binanceOrderClientMock.checkOrder.mockResolvedValueOnce(orderCheckup);
      });

      it('Then order is returned', async () => {
        const result = await orderClient.check(checkOrder);
        expect(result).toEqual(orderCheckup);

        expect(binanceOrderClientMock.checkOrder).toHaveBeenCalledTimes(1);
        const checkOrderParams = binanceOrderClientMock.checkOrder.mock.calls[0];
        expect(checkOrderParams.length).toEqual(1);
        expect(checkOrderParams[0]).toEqual(checkOrder);
      });
    });
  });
});
