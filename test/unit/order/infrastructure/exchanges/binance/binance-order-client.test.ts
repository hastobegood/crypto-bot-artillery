import { roundNumber } from '../../../../../../src/common/util/math.js';
import { extractAssets } from '../../../../../../src/common/util/symbol.js';
import { fromBinanceOrderStatus, toBinanceOrderSide, toBinanceOrderType, toBinanceSymbol } from '../../../../../../src/common/exchanges/binance/binance-converter.js';
import { Client, GetAccountTradesListOutput, GetOrderOutput, SendOrderOutput } from '@hastobegood/crypto-clients-binance';
import { BinanceOrderClient } from '../../../../../../src/order/infrastructure/exchanges/binance/binance-order-client.js';
import { buildDefaultCheckOrder, buildDefaultTransientOrder } from '../../../../../builders/order/domain/order-test-builder.js';
import { buildDefaultBinanceGetAccountTradesListOutput, buildDefaultBinanceGetOrderOutput, buildDefaultBinanceSendOrderOutput } from '../../../../../builders/order/infrastructure/exchanges/binance/binance-order-test-builder.js';
import { CheckOrder, TransientOrder } from '../../../../../../src/order/domain/model/order.js';

const clientMock = jest.mocked(jest.genMockFromModule<Client>('@hastobegood/crypto-clients-binance'), true);

let binanceOrderClient: BinanceOrderClient;
beforeEach(() => {
  clientMock.send = jest.fn();

  binanceOrderClient = new BinanceOrderClient(clientMock);
});

describe('BinanceOrderClient', () => {
  describe('Given the exchange to retrieve', () => {
    it('Then Binance exchange is returned', async () => {
      expect(binanceOrderClient.getExchange()).toEqual('Binance');
    });
  });

  describe('Given an order to send', () => {
    let transientOrder: TransientOrder;
    let sendOrderOutput: SendOrderOutput;

    beforeEach(() => {
      transientOrder = buildDefaultTransientOrder();
    });

    describe('When order is not filled', () => {
      beforeEach(() => {
        sendOrderOutput = {
          ...buildDefaultBinanceSendOrderOutput(),
          status: 'NEW',
          price: '0.00000000',
          executedQty: '0.00000000',
          fills: [],
        };
        clientMock.send.mockResolvedValueOnce({
          status: 200,
          headers: {},
          data: sendOrderOutput,
        });
      });

      it('Then order without executed quantity and price is returned', async () => {
        const result = await binanceOrderClient.sendOrder(transientOrder);
        expect(result).toEqual({
          ...transientOrder,
          status: fromBinanceOrderStatus(sendOrderOutput.status),
          externalId: sendOrderOutput.orderId.toString(),
          externalStatus: sendOrderOutput.status,
          transactionDate: new Date(sendOrderOutput.transactTime),
        });

        expect(clientMock.send).toHaveBeenCalledTimes(1);
        const sendParams = clientMock.send.mock.calls[0];
        expect(sendParams.length).toEqual(1);
        expect(sendParams[0]).toEqual({
          input: {
            symbol: toBinanceSymbol(transientOrder.symbol),
            side: toBinanceOrderSide(transientOrder.side),
            type: toBinanceOrderType(transientOrder.type),
            quoteOrderQty: transientOrder.quote ? transientOrder.requestedQuantity : undefined,
            quantity: !transientOrder.quote ? transientOrder.requestedQuantity : undefined,
            price: transientOrder.requestedPrice,
          },
        });
      });
    });

    describe('When order is filled with commission paid with quote asset', () => {
      beforeEach(() => {
        sendOrderOutput = {
          ...buildDefaultBinanceSendOrderOutput(),
          status: 'FILLED',
        };
        clientMock.send.mockResolvedValueOnce({
          status: 200,
          headers: {},
          data: sendOrderOutput,
        });
      });

      it('Then order without executed quantity and price is returned', async () => {
        const result = await binanceOrderClient.sendOrder(transientOrder);
        expect(result).toEqual({
          ...transientOrder,
          status: fromBinanceOrderStatus(sendOrderOutput.status),
          externalId: sendOrderOutput.orderId.toString(),
          externalStatus: sendOrderOutput.status,
          transactionDate: new Date(sendOrderOutput.transactTime),
          executedQuantity: roundNumber(+sendOrderOutput.executedQty, 15),
          executedPrice: roundNumber(+sendOrderOutput.price, 15),
        });

        expect(clientMock.send).toHaveBeenCalledTimes(1);
        const sendParams = clientMock.send.mock.calls[0];
        expect(sendParams.length).toEqual(1);
        expect(sendParams[0]).toEqual({
          input: {
            symbol: toBinanceSymbol(transientOrder.symbol),
            side: toBinanceOrderSide(transientOrder.side),
            type: toBinanceOrderType(transientOrder.type),
            quoteOrderQty: transientOrder.quote ? transientOrder.requestedQuantity : undefined,
            quantity: !transientOrder.quote ? transientOrder.requestedQuantity : undefined,
            price: transientOrder.requestedPrice,
          },
        });
      });
    });

    describe('When order is filled with commission paid with base asset', () => {
      beforeEach(() => {
        sendOrderOutput = {
          ...buildDefaultBinanceSendOrderOutput(),
          status: 'FILLED',
        };
        sendOrderOutput.fills = sendOrderOutput.fills.map((fill) => ({
          ...fill,
          commissionAsset: extractAssets(transientOrder.symbol).baseAsset,
        }));
        clientMock.send.mockResolvedValueOnce({
          status: 200,
          headers: {},
          data: sendOrderOutput,
        });
      });

      it('Then order without executed quantity and price is returned', async () => {
        const result = await binanceOrderClient.sendOrder(transientOrder);
        expect(result).toEqual({
          ...transientOrder,
          status: fromBinanceOrderStatus(sendOrderOutput.status),
          externalId: sendOrderOutput.orderId.toString(),
          externalStatus: sendOrderOutput.status,
          transactionDate: new Date(sendOrderOutput.transactTime),
          executedQuantity: roundNumber(+sendOrderOutput.executedQty - sendOrderOutput.fills.reduce((total, current) => total + +current.commission, 0), 15),
          executedPrice: roundNumber(+sendOrderOutput.price, 15),
        });

        expect(clientMock.send).toHaveBeenCalledTimes(1);
        const sendParams = clientMock.send.mock.calls[0];
        expect(sendParams.length).toEqual(1);
        expect(sendParams[0]).toEqual({
          input: {
            symbol: toBinanceSymbol(transientOrder.symbol),
            side: toBinanceOrderSide(transientOrder.side),
            type: toBinanceOrderType(transientOrder.type),
            quoteOrderQty: transientOrder.quote ? transientOrder.requestedQuantity : undefined,
            quantity: !transientOrder.quote ? transientOrder.requestedQuantity : undefined,
            price: transientOrder.requestedPrice,
          },
        });
      });
    });
  });

  describe('Given an order to check', () => {
    let checkOrder: CheckOrder;
    let getOrderOutput: GetOrderOutput;
    let getAccountTradesListOutput: GetAccountTradesListOutput;

    beforeEach(() => {
      checkOrder = buildDefaultCheckOrder();
    });

    describe('When order is not filled', () => {
      beforeEach(() => {
        getOrderOutput = {
          ...buildDefaultBinanceGetOrderOutput(),
          status: 'NEW',
          price: '0.00000000',
          executedQty: '0.00000000',
        };
        clientMock.send.mockResolvedValueOnce({
          status: 200,
          headers: {},
          data: getOrderOutput,
        });

        getAccountTradesListOutput = [];
        clientMock.send.mockResolvedValueOnce({
          status: 200,
          headers: {},
          data: getAccountTradesListOutput,
        });
      });

      it('Then order without executed quantity and price is returned', async () => {
        const result = await binanceOrderClient.checkOrder(checkOrder);
        expect(result).toEqual({
          exchange: checkOrder.exchange,
          symbol: checkOrder.symbol,
          status: fromBinanceOrderStatus(getOrderOutput.status),
          externalId: checkOrder.externalId,
          externalStatus: getOrderOutput.status,
        });

        expect(clientMock.send).toHaveBeenCalledTimes(2);
        let sendParams = clientMock.send.mock.calls[0];
        expect(sendParams.length).toEqual(1);
        expect(sendParams[0]).toEqual({
          input: {
            symbol: toBinanceSymbol(checkOrder.symbol),
            orderId: +checkOrder.externalId,
          },
        });
        sendParams = clientMock.send.mock.calls[1];
        expect(sendParams.length).toEqual(1);
        expect(sendParams[0]).toEqual({
          input: {
            symbol: toBinanceSymbol(checkOrder.symbol),
            orderId: +checkOrder.externalId,
          },
        });
      });
    });

    describe('When order is filled with commission paid with quote asset', () => {
      beforeEach(() => {
        getOrderOutput = {
          ...buildDefaultBinanceGetOrderOutput(),
          status: 'FILLED',
        };
        clientMock.send.mockResolvedValueOnce({
          status: 200,
          headers: {},
          data: getOrderOutput,
        });

        getAccountTradesListOutput = buildDefaultBinanceGetAccountTradesListOutput().map((getAccountTradesListOutputSymbol) => ({
          ...getAccountTradesListOutputSymbol,
          commissionAsset: extractAssets(checkOrder.symbol).quoteAsset,
        }));
        clientMock.send.mockResolvedValueOnce({
          status: 200,
          headers: {},
          data: getAccountTradesListOutput,
        });
      });

      it('Then order without commission deducted from executed quantity is returned', async () => {
        const result = await binanceOrderClient.checkOrder(checkOrder);
        expect(result).toEqual({
          exchange: checkOrder.exchange,
          symbol: checkOrder.symbol,
          status: fromBinanceOrderStatus(getOrderOutput.status),
          externalId: checkOrder.externalId,
          externalStatus: getOrderOutput.status,
          executedQuantity: roundNumber(+getOrderOutput.executedQty, 15),
          executedPrice: roundNumber(+getOrderOutput.price, 15),
        });

        expect(clientMock.send).toHaveBeenCalledTimes(2);
        let sendParams = clientMock.send.mock.calls[0];
        expect(sendParams.length).toEqual(1);
        expect(sendParams[0]).toEqual({
          input: {
            symbol: toBinanceSymbol(checkOrder.symbol),
            orderId: +checkOrder.externalId,
          },
        });
        sendParams = clientMock.send.mock.calls[1];
        expect(sendParams.length).toEqual(1);
        expect(sendParams[0]).toEqual({
          input: {
            symbol: toBinanceSymbol(checkOrder.symbol),
            orderId: +checkOrder.externalId,
          },
        });
      });
    });

    describe('When order is filled with commission paid with base asset', () => {
      beforeEach(() => {
        getOrderOutput = {
          ...buildDefaultBinanceGetOrderOutput(),
          status: 'FILLED',
        };
        clientMock.send.mockResolvedValueOnce({
          status: 200,
          headers: {},
          data: getOrderOutput,
        });

        getAccountTradesListOutput = buildDefaultBinanceGetAccountTradesListOutput().map((getAccountTradesListOutputSymbol) => ({
          ...getAccountTradesListOutputSymbol,
          commissionAsset: extractAssets(checkOrder.symbol).baseAsset,
        }));
        clientMock.send.mockResolvedValueOnce({
          status: 200,
          headers: {},
          data: getAccountTradesListOutput,
        });
      });

      it('Then order with commission deducted from executed quantity is returned', async () => {
        const result = await binanceOrderClient.checkOrder(checkOrder);
        expect(result).toEqual({
          exchange: checkOrder.exchange,
          symbol: checkOrder.symbol,
          status: fromBinanceOrderStatus(getOrderOutput.status),
          externalId: checkOrder.externalId,
          externalStatus: getOrderOutput.status,
          executedQuantity: roundNumber(+getOrderOutput.executedQty - getAccountTradesListOutput.reduce((total, current) => total + +current.commission, 0), 15),
          executedPrice: roundNumber(+getOrderOutput.price, 15),
        });

        expect(clientMock.send).toHaveBeenCalledTimes(2);
        let sendParams = clientMock.send.mock.calls[0];
        expect(sendParams.length).toEqual(1);
        expect(sendParams[0]).toEqual({
          input: {
            symbol: toBinanceSymbol(checkOrder.symbol),
            orderId: +checkOrder.externalId,
          },
        });
        sendParams = clientMock.send.mock.calls[1];
        expect(sendParams.length).toEqual(1);
        expect(sendParams[0]).toEqual({
          input: {
            symbol: toBinanceSymbol(checkOrder.symbol),
            orderId: +checkOrder.externalId,
          },
        });
      });
    });
  });
});
