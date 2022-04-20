import { Client, GetExchangeInfoCommand, GetExchangeInfoInput, GetExchangeInfoOutputSymbol, GetExchangeInfoOutputSymbolFilter } from '@hastobegood/crypto-clients-binance';

import { toBinanceSymbol } from '../../../../common/exchanges/binance/binance-converter.js';
import { FetchTicker, Ticker, TickerExchange } from '../../../../ticker/domain/model/ticker.js';
import { ExchangeTickerClient } from '../exchange-ticker-client.js';

export class BinanceTickerClient implements ExchangeTickerClient {
  constructor(private client: Client) {}

  getExchange(): TickerExchange {
    return 'Binance';
  }

  async fetchTicker(fetchTicker: FetchTicker): Promise<Ticker> {
    const input = this.#buildGetExchangeInfoInput(fetchTicker);
    const output = await this.client.send(new GetExchangeInfoCommand(input));

    return {
      exchange: fetchTicker.exchange,
      symbol: fetchTicker.symbol,
      baseAssetPrecision: output.data.symbols[0].baseAssetPrecision,
      quoteAssetPrecision: output.data.symbols[0].quoteAssetPrecision,
      ...this.#getQuantityInfo(output.data.symbols[0]),
      ...this.#getPriceInfo(output.data.symbols[0]),
    };
  }

  #buildGetExchangeInfoInput(fetchTicker: FetchTicker): GetExchangeInfoInput {
    return {
      symbol: toBinanceSymbol(fetchTicker.symbol),
    };
  }

  #getQuantityInfo(symbol: GetExchangeInfoOutputSymbol): { quantityPrecision: number; quantityInterval?: number } {
    const filter = this.#getSymbolFilter(symbol, 'LOT_SIZE');
    if (filter?.filterType !== 'LOT_SIZE') {
      throw new Error(`Unable to find symbol filter 'LOT_SIZE'`);
    }

    return {
      quantityPrecision: this.#extractPrecision(filter.stepSize),
      quantityInterval: +filter.stepSize || undefined,
    };
  }

  #getPriceInfo(symbol: GetExchangeInfoOutputSymbol): { pricePrecision: number; priceInterval?: number } {
    const filter = this.#getSymbolFilter(symbol, 'PRICE_FILTER');
    if (filter?.filterType !== 'PRICE_FILTER') {
      throw new Error(`Unable to find symbol filter 'PRICE_FILTER'`);
    }

    return {
      pricePrecision: this.#extractPrecision(filter.tickSize),
      priceInterval: +filter.tickSize || undefined,
    };
  }

  #getSymbolFilter(symbol: GetExchangeInfoOutputSymbol, filterType: string): GetExchangeInfoOutputSymbolFilter | null {
    return symbol.filters.find((filter) => filter.filterType === filterType) || null;
  }

  #extractPrecision(value: string): number {
    return (+value).toString().split('.')[1]?.length || 0;
  }
}
