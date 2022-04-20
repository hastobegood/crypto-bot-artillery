import { FetchTicker, Ticker, TickerExchange } from '../../../../src/ticker/domain/model/ticker.js';
import { BinanceTickerClient } from '../../../../src/ticker/infrastructure/exchanges/binance/binance-ticker-client.js';
import { HttpTickerClient } from '../../../../src/ticker/infrastructure/http-ticker-client.js';
import { buildDefaultFetchTicker, buildDefaultTicker } from '../../../builders/ticker/domain/ticker-test-builder.js';

const binanceTickerClientMock = jest.mocked(jest.genMockFromModule<BinanceTickerClient>('../../../../src/ticker/infrastructure/exchanges/binance/binance-ticker-client.js'), true);

let tickerClient: HttpTickerClient;
beforeEach(() => {
  binanceTickerClientMock.getExchange = jest.fn();
  binanceTickerClientMock.fetchTicker = jest.fn();

  tickerClient = new HttpTickerClient([binanceTickerClientMock]);
});

describe('HttpTickerClient', () => {
  beforeEach(() => {
    binanceTickerClientMock.getExchange.mockReturnValue('Binance');
  });

  describe('Given a ticker to fetch', () => {
    let fetchTicker: FetchTicker;

    beforeEach(() => {
      fetchTicker = buildDefaultFetchTicker();
    });

    afterEach(() => {
      expect(binanceTickerClientMock.getExchange).toHaveBeenCalledTimes(1);
      const getExchangeParams = binanceTickerClientMock.getExchange.mock.calls[0];
      expect(getExchangeParams.length).toEqual(0);
    });

    describe('When exchange is unknown', () => {
      beforeEach(() => {
        fetchTicker.exchange = 'Unknown' as TickerExchange;
      });

      it('Then error is thrown', async () => {
        try {
          await tickerClient.fetch(fetchTicker);
          fail();
        } catch (error) {
          expect((error as Error).message).toEqual("Unsupported 'Unknown' exchange");
        }

        expect(binanceTickerClientMock.fetchTicker).toHaveBeenCalledTimes(0);
      });
    });

    describe('When exchange is known', () => {
      let ticker: Ticker;

      beforeEach(() => {
        ticker = buildDefaultTicker();

        binanceTickerClientMock.fetchTicker.mockResolvedValueOnce(ticker);
      });

      it('Then ticker is returned', async () => {
        const result = await tickerClient.fetch(fetchTicker);
        expect(result).toEqual(ticker);

        expect(binanceTickerClientMock.fetchTicker).toHaveBeenCalledTimes(1);
        const fetchTickerParams = binanceTickerClientMock.fetchTicker.mock.calls[0];
        expect(fetchTickerParams.length).toEqual(1);
        expect(fetchTickerParams[0]).toEqual(fetchTicker);
      });
    });
  });
});
