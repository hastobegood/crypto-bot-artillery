import { Client } from '@hastobegood/crypto-clients-binance';

import { ExchangesClients } from '../../../src/common/exchanges/clients.js';
import { loadFetchTickerClient } from '../../../src/ticker/artillery.js';
import { FetchTickerClient } from '../../../src/ticker/domain/fetch-ticker-client.js';

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

    describe('When fetch ticker client is loaded', () => {
      it('Then fetch ticker client with exchange is returned', async () => {
        const result = loadFetchTickerClient(exchangesClients);
        expect(result).toBeInstanceOf(FetchTickerClient);
      });
    });
  });
});
