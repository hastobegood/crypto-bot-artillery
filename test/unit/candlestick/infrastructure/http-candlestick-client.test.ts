import { BinanceCandlestickClient } from '../../../../src/candlestick/infrastructure/exchanges/binance/binance-candlestick-client.js';
import { HttpCandlestickClient } from '../../../../src/candlestick/infrastructure/http-candlestick-client.js';
import { CandlestickExchange, Candlesticks, FetchAllCandlesticks } from '../../../../src/candlestick/domain/model/candlestick.js';
import { buildDefaultCandlesticks, buildDefaultFetchAllCandlesticks } from '../../../builders/candlestick/domain/candlestick-test-builder.js';

const binanceCandlestickClientMock = jest.mocked(jest.genMockFromModule<BinanceCandlestickClient>('../../../../src/candlestick/infrastructure/exchanges/binance/binance-candlestick-client.js'), true);

let candlestickClient: HttpCandlestickClient;
beforeEach(() => {
  binanceCandlestickClientMock.getExchange = jest.fn();
  binanceCandlestickClientMock.fetchAllCandlesticks = jest.fn();

  candlestickClient = new HttpCandlestickClient([binanceCandlestickClientMock]);
});

describe('HttpCandlestickClient', () => {
  beforeEach(() => {
    binanceCandlestickClientMock.getExchange.mockReturnValue('Binance');
  });

  describe('Given all candlesticks to fetch', () => {
    let fetchAllCandlesticks: FetchAllCandlesticks;

    beforeEach(() => {
      fetchAllCandlesticks = buildDefaultFetchAllCandlesticks();
    });

    afterEach(() => {
      expect(binanceCandlestickClientMock.getExchange).toHaveBeenCalledTimes(1);
      const getExchangeParams = binanceCandlestickClientMock.getExchange.mock.calls[0];
      expect(getExchangeParams.length).toEqual(0);
    });

    describe('When exchange is unknown', () => {
      beforeEach(() => {
        fetchAllCandlesticks.exchange = 'Unknown' as CandlestickExchange;
      });

      it('Then error is thrown', async () => {
        try {
          await candlestickClient.fetchAll(fetchAllCandlesticks);
          fail();
        } catch (error) {
          expect((error as Error).message).toEqual("Unsupported 'Unknown' exchange");
        }

        expect(binanceCandlestickClientMock.fetchAllCandlesticks).toHaveBeenCalledTimes(0);
      });
    });

    describe('When exchange is known', () => {
      let candlesticks: Candlesticks;

      beforeEach(() => {
        candlesticks = buildDefaultCandlesticks();

        binanceCandlestickClientMock.fetchAllCandlesticks.mockResolvedValueOnce(candlesticks);
      });

      it('Then candlestick is returned', async () => {
        const result = await candlestickClient.fetchAll(fetchAllCandlesticks);
        expect(result).toEqual(candlesticks);

        expect(binanceCandlestickClientMock.fetchAllCandlesticks).toHaveBeenCalledTimes(1);
        const fetchAllCandlesticksParams = binanceCandlestickClientMock.fetchAllCandlesticks.mock.calls[0];
        expect(fetchAllCandlesticksParams.length).toEqual(1);
        expect(fetchAllCandlesticksParams[0]).toEqual(fetchAllCandlesticks);
      });
    });
  });
});
