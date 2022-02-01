import { randomUUID } from 'crypto';
import { truncateNumber } from '../../common/util/math.js';
import { FetchTickerClient } from '../../ticker/domain/fetch-ticker-client.js';
import { Ticker } from '../../ticker/domain/model/ticker.js';
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
      requestedQuantity: this.#buildQuantity(sendOrder, ticker),
      requestedPrice: this.#buildPrice(sendOrder, ticker),
    };
  }

  #buildQuantity(sendOrder: SendOrder, ticker: Ticker): number {
    if (sendOrder.quote) {
      return sendOrder.requestedQuantity;
    }

    return truncateNumber(this.#applyInterval(sendOrder.requestedQuantity, ticker.quantityInterval), ticker.quantityPrecision);
  }

  #buildPrice(sendOrder: SendOrder, ticker: Ticker): number | undefined {
    if (!sendOrder.requestedPrice) {
      return undefined;
    }

    return truncateNumber(this.#applyInterval(sendOrder.requestedPrice, ticker.priceInterval), ticker.pricePrecision);
  }

  #applyInterval(value: number, interval?: number): number {
    return value - (interval ? value % interval : 0);
  }
}
