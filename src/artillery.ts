import { ApiInfoProvider, Client } from '@hastobegood/crypto-clients-binance';
import { ExchangesClients } from './common/exchanges/clients.js';

export interface ArtilleryOptions {
  binanceApiInfoProvider?: ApiInfoProvider;
}

export const loadExchangesClients = (artilleryOptions: ArtilleryOptions): ExchangesClients => {
  return {
    binanceClient: artilleryOptions.binanceApiInfoProvider ? new Client(artilleryOptions.binanceApiInfoProvider) : undefined,
  };
};
