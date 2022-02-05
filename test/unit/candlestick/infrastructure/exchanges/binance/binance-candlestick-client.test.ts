import { toBinanceSymbol } from '../../../../../../src/common/exchanges/binance/binance-converter.js';
import { FetchAllCandlesticks } from '../../../../../../src/candlestick/domain/model/candlestick.js';
import { buildDefaultFetchAllCandlesticks } from '../../../../../builders/candlestick/domain/candlestick-test-builder.js';
import { Client, GetCandlestickDataOutput } from '@hastobegood/crypto-clients-binance';
import { BinanceCandlestickClient } from '../../../../../../src/candlestick/infrastructure/exchanges/binance/binance-candlestick-client.js';
import { buildDefaultBinanceGetCandlestickDataOutput } from '../../../../../builders/candlestick/infrastructure/exchanges/binance/binance-candlestick-test-builder.js';

const clientMock = jest.mocked(jest.genMockFromModule<Client>('@hastobegood/crypto-clients-binance'), true);

let binanceCandlestickClient: BinanceCandlestickClient;
beforeEach(() => {
  clientMock.send = jest.fn();

  binanceCandlestickClient = new BinanceCandlestickClient(clientMock);
});

describe('BinanceCandlestickClient', () => {
  describe('Given the exchange to retrieve', () => {
    it('Then Binance exchange is returned', async () => {
      expect(binanceCandlestickClient.getExchange()).toEqual('Binance');
    });
  });

  describe('Given all candlesticks to fetch', () => {
    let fetchAllCandlesticks: FetchAllCandlesticks;
    let getCandlestickDataOutput: GetCandlestickDataOutput;

    beforeEach(() => {
      fetchAllCandlesticks = buildDefaultFetchAllCandlesticks();
    });

    describe('When candlesticks are found', () => {
      beforeEach(() => {
        getCandlestickDataOutput = buildDefaultBinanceGetCandlestickDataOutput();

        clientMock.send.mockResolvedValueOnce({
          status: 200,
          headers: {},
          data: getCandlestickDataOutput,
        });
      });

      it('Then candlestick is returned', async () => {
        const result = await binanceCandlestickClient.fetchAllCandlesticks(fetchAllCandlesticks);
        expect(result).toEqual({
          ...fetchAllCandlesticks,
          values: getCandlestickDataOutput.map((element) => ({
            openingDate: element[0],
            closingDate: element[6],
            openingPrice: +element[1],
            closingPrice: +element[4],
            lowestPrice: +element[3],
            highestPrice: +element[2],
            volume: +element[5],
          })),
        });

        expect(clientMock.send).toHaveBeenCalledTimes(1);
        const sendParams = clientMock.send.mock.calls[0];
        expect(sendParams.length).toEqual(1);
        expect(sendParams[0]).toEqual({
          input: {
            symbol: toBinanceSymbol(fetchAllCandlesticks.symbol),
            interval: fetchAllCandlesticks.interval,
            startTime: fetchAllCandlesticks.startDate,
            endTime: fetchAllCandlesticks.endDate,
            limit: fetchAllCandlesticks.period,
          },
        });
      });
    });
  });
});
