import { toBinanceSymbol } from '../../../../common/exchanges/binance/binance-converter.js';
import { ExchangeCandlestickClient } from '../exchange-candlestick-client.js';
import { Client, GetCandlestickDataCommand, GetCandlestickDataInput } from '@hastobegood/crypto-clients-binance';
import { CandlestickExchange, Candlesticks, FetchAllCandlesticks } from '../../../../candlestick/domain/model/candlestick.js';

export class BinanceCandlestickClient implements ExchangeCandlestickClient {
  constructor(private client: Client) {}

  getExchange(): CandlestickExchange {
    return 'Binance';
  }

  async fetchAllCandlesticks(fetchAllCandlesticks: FetchAllCandlesticks): Promise<Candlesticks> {
    const input = this.#buildGetGetCandlestickDataInput(fetchAllCandlesticks);
    const output = await this.client.send(new GetCandlestickDataCommand(input));

    return {
      ...fetchAllCandlesticks,
      values: output.data.map((element) => ({
        openingDate: element[0],
        closingDate: element[6],
        openingPrice: +element[1],
        closingPrice: +element[4],
        lowestPrice: +element[3],
        highestPrice: +element[2],
        volume: +element[5],
      })),
    };
  }

  #buildGetGetCandlestickDataInput(fetchAllCandlesticks: FetchAllCandlesticks): GetCandlestickDataInput {
    return {
      symbol: toBinanceSymbol(fetchAllCandlesticks.symbol),
      interval: fetchAllCandlesticks.interval,
      startTime: fetchAllCandlesticks.startDate,
      endTime: fetchAllCandlesticks.endDate,
      limit: fetchAllCandlesticks.period,
    };
  }
}
