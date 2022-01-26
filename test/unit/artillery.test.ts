import { ApiInfoProvider, Client } from '@hastobegood/crypto-clients-binance';
import { ArtilleryOptions, loadExchangesClients } from '../../src/artillery.js';

describe('Artillery', () => {
  describe('Given an empty artillery options', () => {
    let artilleryOptions: ArtilleryOptions;

    beforeEach(() => {
      artilleryOptions = {};
    });

    describe('When exchanges clients are loaded', () => {
      it('Then empty object is returned', async () => {
        const result = loadExchangesClients(artilleryOptions);
        expect(result).toEqual({});
      });
    });
  });

  describe('Given a non empty artillery options', () => {
    let artilleryOptions: ArtilleryOptions;
    let binanceApiInfoProvider: ApiInfoProvider;

    beforeEach(() => {
      binanceApiInfoProvider = {
        getApiUrl: async (): Promise<string> => 'binance-api-url',
        getApiKey: async (): Promise<string> => 'binance-api-key',
        getSecretKey: async (): Promise<string> => 'binance-secret-key',
      };

      artilleryOptions = {
        binanceApiInfoProvider: binanceApiInfoProvider,
      };
    });

    describe('When exchanges clients are loaded', () => {
      it('Then non empty object is returned', async () => {
        const result = loadExchangesClients(artilleryOptions);
        expect(result).toEqual({
          binanceClient: new Client(binanceApiInfoProvider),
        });
      });
    });
  });
});
