import { FetchTickerClient } from '../../../../src/ticker/domain/fetch-ticker-client.js';
import { FetchTicker, Ticker } from '../../../../src/ticker/domain/model/ticker.js';
import { TickerClient } from '../../../../src/ticker/domain/ticker-client.js';
import { buildDefaultFetchTicker, buildDefaultTicker } from '../../../builders/ticker/domain/ticker-test-builder.js';

const tickerClientMock = jest.mocked(jest.genMockFromModule<TickerClient>('../../../../src/ticker/domain/ticker-client.js'), true);

let fetchTickerClient: FetchTickerClient;
beforeEach(() => {
  tickerClientMock.fetch = jest.fn();
});

describe('FetchTickerClient', () => {
  describe('Given a ticker to fetch without cache', () => {
    let fetchTicker: FetchTicker;

    beforeEach(() => {
      fetchTickerClient = new FetchTickerClient(tickerClientMock);

      fetchTicker = buildDefaultFetchTicker();
    });

    describe('When ticker is found', () => {
      let ticker: Ticker;

      beforeEach(() => {
        ticker = buildDefaultTicker();
        tickerClientMock.fetch.mockResolvedValue(ticker);
      });

      it('Then ticker is returned', async () => {
        let result = await fetchTickerClient.fetch(fetchTicker);
        expect(result).toEqual(ticker);
        result = await fetchTickerClient.fetch(fetchTicker);
        expect(result).toEqual(ticker);

        expect(tickerClientMock.fetch).toHaveBeenCalledTimes(2);
        let fetchParams = tickerClientMock.fetch.mock.calls[0];
        expect(fetchParams.length).toEqual(1);
        expect(fetchParams[0]).toEqual(fetchTicker);
        fetchParams = tickerClientMock.fetch.mock.calls[1];
        expect(fetchParams.length).toEqual(1);
        expect(fetchParams[0]).toEqual(fetchTicker);
      });
    });
  });

  describe('Given a ticker to fetch with cache', () => {
    let fetchTicker: FetchTicker;

    beforeEach(() => {
      fetchTickerClient = new FetchTickerClient(tickerClientMock, 0);

      fetchTicker = buildDefaultFetchTicker();
    });

    describe('When ticker is found', () => {
      let ticker: Ticker;

      beforeEach(() => {
        ticker = buildDefaultTicker();
        tickerClientMock.fetch.mockResolvedValue(ticker);
      });

      it('Then ticker is returned', async () => {
        let result = await fetchTickerClient.fetch(fetchTicker);
        expect(result).toEqual(ticker);
        result = await fetchTickerClient.fetch(fetchTicker);
        expect(result).toEqual(ticker);

        expect(tickerClientMock.fetch).toHaveBeenCalledTimes(1);
        const fetchParams = tickerClientMock.fetch.mock.calls[0];
        expect(fetchParams.length).toEqual(1);
        expect(fetchParams[0]).toEqual(fetchTicker);
      });
    });
  });
});
