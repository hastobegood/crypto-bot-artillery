import { Client } from '@hastobegood/crypto-clients-binance';

import { loadFetchCandlestickClient } from '../../../src/candlestick/artillery.js';
import { FetchCandlestickClient } from '../../../src/candlestick/domain/fetch-candlestick-client.js';
import { ExchangesClients } from '../../../src/common/exchanges/clients.js';

describe('Artillery', () => {
  describe('Given exchanges clients', () => {
    let exchangesClients: ExchangesClients;

    beforeEach(() => {
      exchangesClients = {
        binanceClient: new Client({
          apiInfoProvider: {
            getApiUrl: async (): Promise<string> => 'binance-api-url',
            getApiKey: async (): Promise<string> => 'binance-api-key',
            getSecretKey: async (): Promise<string> => 'binance-secret-key',
          },
        }),
      };
    });

    describe('When fetch candlestick client is loaded', () => {
      it('Then fetch candlestick client with exchange is returned', async () => {
        const result = loadFetchCandlestickClient(exchangesClients);
        expect(result).toBeInstanceOf(FetchCandlestickClient);
      });
    });
  });
});
