import { buildDefaultFetchAllCandlesticks } from '../builders/candlestick/domain/candlestick-test-builder.js';
import { buildDefaultCheckOrder, buildDefaultSendOrder } from '../builders/order/domain/order-test-builder.js';
import { buildDefaultFetchTicker } from '../builders/ticker/domain/ticker-test-builder.js';
import { Artillery } from '../../src/artillery.js';

describe('Artillery', () => {
  describe('Given an artillery without option', () => {
    let artillery: Artillery;

    beforeEach(() => {
      artillery = new Artillery({});
    });

    describe('When candlestick artillery is called', () => {
      it('Then error is thrown', async () => {
        try {
          await artillery.loadFetchCandlestickClient().fetchAll(buildDefaultFetchAllCandlesticks());
          fail();
        } catch (error) {
          expect((error as Error).message).toEqual("Unsupported 'Binance' exchange");
        }
      });
    });

    describe('When order artillery is called', () => {
      it('Then error is thrown', async () => {
        try {
          await artillery.loadSendOrderClient().send(buildDefaultSendOrder());
          fail();
        } catch (error) {
          expect((error as Error).message).toEqual("Unsupported 'Binance' exchange");
        }

        try {
          await artillery.loadCheckOrderClient().check(buildDefaultCheckOrder());
          fail();
        } catch (error) {
          expect((error as Error).message).toEqual("Unsupported 'Binance' exchange");
        }
      });
    });

    describe('When ticker artillery is called', () => {
      it('Then error is thrown', async () => {
        try {
          await artillery.loadFetchTickerClient().fetch(buildDefaultFetchTicker());
          fail();
        } catch (error) {
          expect((error as Error).message).toEqual("Unsupported 'Binance' exchange");
        }
      });
    });
  });
});
