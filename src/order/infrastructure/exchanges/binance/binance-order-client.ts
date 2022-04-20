import { Client, GetAccountTradesListCommand, GetAccountTradesListInput, GetOrderCommand, GetOrderInput, GetOrderOutput, SendOrderCommand, SendOrderInput, SendOrderOutput } from '@hastobegood/crypto-clients-binance';

import { fromBinanceOrderStatus, toBinanceOrderSide, toBinanceOrderType, toBinanceSymbol } from '../../../../common/exchanges/binance/binance-converter.js';
import { roundNumber } from '../../../../common/util/math.js';
import { extractAssets } from '../../../../common/util/symbol.js';
import { CheckOrder, Order, OrderCheckup, OrderExchange, TransientOrder } from '../../../../order/domain/model/order.js';
import { ExchangeOrderClient } from '../exchange-order-client.js';

export class BinanceOrderClient implements ExchangeOrderClient {
  constructor(private client: Client) {}

  getExchange(): OrderExchange {
    return 'Binance';
  }

  async sendOrder(transientOrder: TransientOrder): Promise<Order> {
    const input = this.#buildSendOrderCommandInput(transientOrder);
    const output = await this.client.send(new SendOrderCommand(input));

    const executedQuantityAndPrice = this.#calculateExecutedQuantityAndPrice(transientOrder.symbol, output.data, output.data.fills);

    return {
      ...transientOrder,
      status: fromBinanceOrderStatus(output.data.status),
      externalId: output.data.orderId.toString(),
      externalStatus: output.data.status,
      transactionDate: new Date(output.data.transactTime),
      executedQuantity: executedQuantityAndPrice?.quantity,
      executedPrice: executedQuantityAndPrice?.price,
    };
  }

  #buildSendOrderCommandInput(transientOrder: TransientOrder): SendOrderInput {
    return {
      symbol: toBinanceSymbol(transientOrder.symbol),
      side: toBinanceOrderSide(transientOrder.side),
      type: toBinanceOrderType(transientOrder.type),
      quoteOrderQty: transientOrder.quote ? transientOrder.requestedQuantity : undefined,
      quantity: !transientOrder.quote ? transientOrder.requestedQuantity : undefined,
      price: transientOrder.requestedPrice,
    };
  }

  async checkOrder(checkOrder: CheckOrder): Promise<OrderCheckup> {
    const orderInput = this.#buildGetOrderInput(checkOrder);
    const tradesInput = this.#buildGetAccountTradesListInput(checkOrder);
    const [orderOutput, tradesOutput] = await Promise.all([this.client.send(new GetOrderCommand(orderInput)), this.client.send(new GetAccountTradesListCommand(tradesInput))]);

    const executedQuantityAndPrice = this.#calculateExecutedQuantityAndPrice(checkOrder.symbol, orderOutput.data, tradesOutput.data);

    return {
      exchange: checkOrder.exchange,
      symbol: checkOrder.symbol,
      status: fromBinanceOrderStatus(orderOutput.data.status),
      externalId: checkOrder.externalId,
      externalStatus: orderOutput.data.status,
      executedQuantity: executedQuantityAndPrice?.quantity,
      executedPrice: executedQuantityAndPrice?.price,
    };
  }

  #buildGetOrderInput(checkOrder: CheckOrder): GetOrderInput {
    return {
      symbol: toBinanceSymbol(checkOrder.symbol),
      orderId: +checkOrder.externalId,
    };
  }

  #buildGetAccountTradesListInput(checkOrder: CheckOrder): GetAccountTradesListInput {
    return {
      symbol: toBinanceSymbol(checkOrder.symbol),
      orderId: +checkOrder.externalId,
    };
  }

  #calculateExecutedQuantityAndPrice(symbol: string, output: SendOrderOutput | GetOrderOutput, fills: { commissionAsset: string; commission: string }[]): { quantity: number; price: number } | undefined {
    let totalQuantity = +output.executedQty;
    if (totalQuantity === 0) {
      return undefined;
    }

    // when commission is paid with the base asset, commission quantity should be deducted from executed quantity
    if (fills.length > 0) {
      const baseAsset = extractAssets(symbol).baseAsset;
      const commissionFills = fills.filter((fill) => fill.commissionAsset === baseAsset);
      totalQuantity -= commissionFills.reduce((total, current) => total + +current.commission, 0);
    }
    return {
      quantity: roundNumber(totalQuantity, 15),
      price: roundNumber(+output.price > 0 ? +output.price : +output.cummulativeQuoteQty / totalQuantity, 15),
    };
  }
}
