import { randomUUID } from 'crypto';
import { truncateNumber } from '../../common/util/math.js';
import { FetchTickerClient } from '../../ticker/domain/fetch-ticker-client.js';
import { Order, SendOrder, TransientOrder } from './model/order.js';
import { OrderClient } from './order-client.js';

export class SendOrderClient {
  constructor(private fetchTickerClient: FetchTickerClient, private orderClient: OrderClient) {}

  async send(sendOrder: SendOrder): Promise<Order> {
    const transientOrder = await this.#buildTransientOrder(sendOrder);

    return this.orderClient.send(transientOrder);
  }

  async #buildTransientOrder(sendOrder: SendOrder): Promise<TransientOrder> {
    if (sendOrder.type === 'Market' && sendOrder.requestedPrice) {
      throw new Error('Unable to send a market order with price limit');
    }
    if (sendOrder.type === 'Limit') {
      if (sendOrder.quote) {
        throw new Error('Unable to send a limit order using quote asset quantity');
      }
      if (!sendOrder.requestedPrice) {
        throw new Error('Unable to send a limit order without price limit');
      }
    }

    const creationDate = new Date();
    const ticker = await this.fetchTickerClient.fetch({ exchange: sendOrder.exchange, symbol: sendOrder.symbol });

    return {
      ...sendOrder,
      id: randomUUID(),
      creationDate: creationDate,
      requestedQuantity: this.#buildValue(sendOrder.requestedQuantity, sendOrder.quote ? ticker.quoteAssetPrecision : ticker.quantityPrecision, ticker.quantityInterval),
      requestedPrice: sendOrder.requestedPrice ? this.#buildValue(sendOrder.requestedPrice, ticker.pricePrecision, ticker.priceInterval) : undefined,
    };
  }

  #buildValue(value: number, precision: number, interval?: number): number {
    return truncateNumber(value - (interval ? value % interval : 0), precision);
  }
}
