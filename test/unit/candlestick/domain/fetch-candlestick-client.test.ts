import { CandlestickClient } from '../../../../src/candlestick/domain/candlestick-client.js';
import { FetchCandlestickClient } from '../../../../src/candlestick/domain/fetch-candlestick-client.js';
import { Candlesticks, FetchAllCandlesticks } from '../../../../src/candlestick/domain/model/candlestick.js';
import { buildDefaultCandlesticks, buildDefaultFetchAllCandlesticks } from '../../../builders/candlestick/domain/candlestick-test-builder.js';

const candlestickClientMock = jest.mocked(jest.genMockFromModule<CandlestickClient>('../../../../src/candlestick/domain/candlestick-client.js'), true);

let fetchCandlestickClient: FetchCandlestickClient;
beforeEach(() => {
  candlestickClientMock.fetchAll = jest.fn();

  fetchCandlestickClient = new FetchCandlestickClient(candlestickClientMock);
});

describe('FetchCandlestickClient', () => {
  describe('Given all candlesticks to fetch', () => {
    let fetchAllCandlesticks: FetchAllCandlesticks;

    beforeEach(() => {
      fetchAllCandlesticks = buildDefaultFetchAllCandlesticks();
    });

    describe('When candlesticks are found', () => {
      let candlesticks: Candlesticks;

      beforeEach(() => {
        candlesticks = buildDefaultCandlesticks();
        candlestickClientMock.fetchAll.mockResolvedValue(candlesticks);
      });

      it('Then candlesticks are returned', async () => {
        const result = await fetchCandlestickClient.fetchAll(fetchAllCandlesticks);
        expect(result).toEqual(candlesticks);

        expect(candlestickClientMock.fetchAll).toHaveBeenCalledTimes(1);
        const fetchAllParams = candlestickClientMock.fetchAll.mock.calls[0];
        expect(fetchAllParams.length).toEqual(1);
        expect(fetchAllParams[0]).toEqual(fetchAllCandlesticks);
      });
    });
  });
});
