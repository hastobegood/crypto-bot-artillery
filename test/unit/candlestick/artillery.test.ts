import { Client } from '@hastobegood/crypto-clients-binance';
import { ExchangesClients } from '../../../src/common/exchanges/clients.js';
import { FetchCandlestickClient } from '../../../src/candlestick/domain/fetch-candlestick-client.js';
import { loadFetchCandlestickClient } from '../../../src/candlestick/artillery.js';

describe('Artillery', () => {
  describe('Given exchanges clients', () => {
    let exchangesClients: ExchangesClients;

    beforeEach(() => {
      exchangesClients = {
        binanceClient: new Client({
          getApiUrl: async (): Promise<string> => 'binance-api-url',
          getApiKey: async (): Promise<string> => 'binance-api-key',
          getSecretKey: async (): Promise<string> => 'binance-secret-key',
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
