import { ApiInfoProvider, Client } from '@hastobegood/crypto-clients-binance';

import { BinanceCandlestickClient } from './candlestick/infrastructure/exchanges/binance/binance-candlestick-client.js';
import { ExchangeCandlestickClient } from './candlestick/infrastructure/exchanges/exchange-candlestick-client.js';
import { HttpCandlestickClient } from './candlestick/infrastructure/http-candlestick-client.js';
import { CandlestickClient } from './candlestick/domain/candlestick-client.js';
import { FetchCandlestickClient } from './candlestick/domain/fetch-candlestick-client.js';

import { BinanceOrderClient } from './order/infrastructure/exchanges/binance/binance-order-client.js';
import { ExchangeOrderClient } from './order/infrastructure/exchanges/exchange-order-client.js';
import { HttpOrderClient } from './order/infrastructure/http-order-client.js';
import { OrderClient } from './order/domain/order-client.js';
import { SendOrderClient } from './order/domain/send-order-client.js';
import { CheckOrderClient } from './order/domain/check-order-client.js';

import { BinanceTickerClient } from './ticker/infrastructure/exchanges/binance/binance-ticker-client.js';
import { ExchangeTickerClient } from './ticker/infrastructure/exchanges/exchange-ticker-client.js';
import { HttpTickerClient } from './ticker/infrastructure/http-ticker-client.js';
import { TickerClient } from './ticker/domain/ticker-client.js';
import { FetchTickerClient } from './ticker/domain/fetch-ticker-client.js';

export interface ArtilleryOptions {
  binanceApiInfoProvider?: ApiInfoProvider;
}

export class Artillery {
  readonly #binanceClient?: Client;

  #candlestickClient?: CandlestickClient;
  #fetchCandlestickClient?: FetchCandlestickClient;

  #orderClient?: OrderClient;
  #sendOrderClient?: SendOrderClient;
  #checkOrderClient?: CheckOrderClient;

  #tickerClient?: TickerClient;
  #fetchTickerClient?: FetchTickerClient;

  constructor(private artilleryOptions: ArtilleryOptions) {
    if (artilleryOptions.binanceApiInfoProvider) {
      this.#binanceClient = new Client(artilleryOptions.binanceApiInfoProvider);
    }
  }

  #loadCandlestickClient(): CandlestickClient {
    if (!this.#candlestickClient) {
      const candlestickClients: ExchangeCandlestickClient[] = [];
      if (this.#binanceClient) {
        candlestickClients.push(new BinanceCandlestickClient(this.#binanceClient));
      }
      this.#candlestickClient = new HttpCandlestickClient(candlestickClients);
    }
    return this.#candlestickClient;
  }

  loadFetchCandlestickClient(): FetchCandlestickClient {
    if (!this.#fetchCandlestickClient) {
      this.#fetchCandlestickClient = new FetchCandlestickClient(this.#loadCandlestickClient());
    }
    return this.#fetchCandlestickClient;
  }

  #loadOrderClient(): OrderClient {
    if (!this.#orderClient) {
      const orderClients: ExchangeOrderClient[] = [];
      if (this.#binanceClient) {
        orderClients.push(new BinanceOrderClient(this.#binanceClient));
      }
      this.#orderClient = new HttpOrderClient(orderClients);
    }
    return this.#orderClient;
  }

  loadSendOrderClient(): SendOrderClient {
    if (!this.#sendOrderClient) {
      this.#sendOrderClient = new SendOrderClient(this.loadFetchTickerClient(), this.#loadOrderClient());
    }
    return this.#sendOrderClient;
  }

  loadCheckOrderClient(): CheckOrderClient {
    if (!this.#checkOrderClient) {
      this.#checkOrderClient = new CheckOrderClient(this.#loadOrderClient());
    }
    return this.#checkOrderClient;
  }

  #loadTickerClient(): TickerClient {
    if (!this.#tickerClient) {
      const tickerClients: ExchangeTickerClient[] = [];
      if (this.#binanceClient) {
        tickerClients.push(new BinanceTickerClient(this.#binanceClient));
      }
      this.#tickerClient = new HttpTickerClient(tickerClients);
    }
    return this.#tickerClient;
  }

  loadFetchTickerClient(): FetchTickerClient {
    if (!this.#fetchTickerClient) {
      this.#fetchTickerClient = new FetchTickerClient(this.#loadTickerClient());
    }
    return this.#fetchTickerClient;
  }
}
