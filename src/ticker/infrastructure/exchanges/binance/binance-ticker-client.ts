import { toBinanceSymbol } from '../../../../common/exchanges/binance/binance-converter.js';
import { ExchangeTickerClient } from '../exchange-ticker-client.js';
import { Client, GetExchangeInfoCommand, GetExchangeInfoInput, GetExchangeInfoOutputSymbol } from '@hastobegood/crypto-clients-binance';
import { FetchTicker, Ticker, TickerExchange } from '../../../../ticker/domain/model/ticker.js';

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
      quantityPrecision: this.#extractPrecision(this.#getLotSizeFilter(output.data.symbols)!.stepSize!),
      pricePrecision: this.#extractPrecision(this.#getPriceFilter(output.data.symbols)!.tickSize!),
    };
  }

  #buildGetExchangeInfoInput(fetchTicker: FetchTicker): GetExchangeInfoInput {
    return {
      symbol: toBinanceSymbol(fetchTicker.symbol),
    };
  }

  #getLotSizeFilter(symbols: GetExchangeInfoOutputSymbol[]) {
    const filter = this.#getSymbolFilter(symbols, 'LOT_SIZE');

    return filter?.filterType === 'LOT_SIZE' ? filter : null;
  }

  #getPriceFilter(symbols: GetExchangeInfoOutputSymbol[]) {
    const filter = this.#getSymbolFilter(symbols, 'PRICE_FILTER');

    return filter?.filterType === 'PRICE_FILTER' ? filter : null;
  }

  #getSymbolFilter(symbols: GetExchangeInfoOutputSymbol[], filterType: string) {
    return symbols[0].filters.find((filter) => filter.filterType === filterType);
  }

  #extractPrecision(value: string): number {
    return (+value).toString().split('.')[1]?.length || 0;
  }
}
