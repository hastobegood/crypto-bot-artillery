import { OrderStatus as BinanceOrderStatus } from '@hastobegood/crypto-clients-binance';

import { fromBinanceOrderStatus, toBinanceOrderSide, toBinanceOrderType, toBinanceSymbol } from '../../../../../src/common/exchanges/binance/binance-converter.js';
import { OrderSide, OrderType } from '../../../../../src/order/domain/model/order.js';

describe('BinanceConverter', () => {
  describe('Given a symbol to convert to Binance', () => {
    describe('When invalid value', () => {
      it('Then error is thrown', async () => {
        try {
          toBinanceSymbol('ABCDEF');
          fail();
        } catch (error) {
          expect((error as Error).message).toEqual("Unable to extract assets, symbol 'ABCDEF' is invalid");
        }

        try {
          toBinanceSymbol('AB#CD#EF');
          fail();
        } catch (error) {
          expect((error as Error).message).toEqual("Unable to extract assets, symbol 'AB#CD#EF' is invalid");
        }
      });
    });

    describe('When valid value', () => {
      it('Then converted value is returned', async () => {
        const result = toBinanceSymbol('ABC#DEF');
        expect(result).toEqual('ABCDEF');
      });
    });
  });

  describe('Given an order side to convert to Binance', () => {
    describe('When invalid value', () => {
      it('Then error is thrown', async () => {
        try {
          toBinanceOrderSide('XXX' as OrderSide);
          fail();
        } catch (error) {
          expect((error as Error).message).toEqual("Unsupported 'XXX' Binance order side");
        }
      });
    });

    describe('When valid value', () => {
      it('Then converted value is returned', async () => {
        expect(toBinanceOrderSide('Buy')).toEqual('BUY');
        expect(toBinanceOrderSide('Sell')).toEqual('SELL');
      });
    });
  });

  describe('Given an order type to convert to Binance', () => {
    describe('When invalid value', () => {
      it('Then error is thrown', async () => {
        try {
          toBinanceOrderType('XXX' as OrderType);
          fail();
        } catch (error) {
          expect((error as Error).message).toEqual("Unsupported 'XXX' Binance order type");
        }
      });
    });

    describe('When valid value', () => {
      it('Then converted value is returned', async () => {
        expect(toBinanceOrderType('Market')).toEqual('MARKET');
        expect(toBinanceOrderType('Limit')).toEqual('LIMIT');
      });
    });
  });

  describe('Given an order status to convert from Binance', () => {
    describe('When invalid value', () => {
      it('Then unknown value is returned', async () => {
        expect(fromBinanceOrderStatus('XXX' as BinanceOrderStatus)).toEqual('Unknown');
      });
    });

    describe('When valid value', () => {
      it('Then converted value is returned', async () => {
        expect(fromBinanceOrderStatus('NEW')).toEqual('Waiting');
        expect(fromBinanceOrderStatus('PARTIALLY_FILLED')).toEqual('PartiallyFilled');
        expect(fromBinanceOrderStatus('FILLED')).toEqual('Filled');
        expect(fromBinanceOrderStatus('PENDING_CANCEL')).toEqual('Canceled');
        expect(fromBinanceOrderStatus('CANCELED')).toEqual('Canceled');
        expect(fromBinanceOrderStatus('EXPIRED')).toEqual('Error');
        expect(fromBinanceOrderStatus('REJECTED')).toEqual('Error');
      });
    });
  });
});
