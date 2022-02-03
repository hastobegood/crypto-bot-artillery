import { Client } from '@hastobegood/crypto-clients-binance';
import { ExchangesClients } from '../../../src/common/exchanges/clients.js';
import { HttpTickerClient } from '../../../src/ticker/infrastructure/http-ticker-client.js';
import { FetchTickerClient } from '../../../src/ticker/domain/fetch-ticker-client.js';
import { SendOrderClient } from '../../../src/order/domain/send-order-client.js';
import { CheckOrderClient } from '../../../src/order/domain/check-order-client.js';
import { loadCheckOrderClient, loadSendOrderClient } from '../../../src/order/artillery.js';

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

    describe('When send order client is loaded', () => {
      it('Then send order client with exchange is returned', async () => {
        const fetchTickerClient = new FetchTickerClient(new HttpTickerClient([]));
        const result = loadSendOrderClient(exchangesClients, fetchTickerClient);
        expect(result).toBeInstanceOf(SendOrderClient);
      });
    });

    describe('When check order client is loaded', () => {
      it('Then check order client with exchange is returned', async () => {
        const result = loadCheckOrderClient(exchangesClients);
        expect(result).toBeInstanceOf(CheckOrderClient);
      });
    });
  });
});
