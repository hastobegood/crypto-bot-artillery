import { ApiInfoProvider, Client } from '@hastobegood/crypto-clients-binance';

import { ExchangesClients } from './common/exchanges/clients.js';
import { logger } from './common/log/logger.js';

export interface ArtilleryOptions {
  binanceApiInfoProvider?: ApiInfoProvider;
}

export const loadExchangesClients = (artilleryOptions: ArtilleryOptions): ExchangesClients => {
  return {
    binanceClient: loadBinanceClient(artilleryOptions.binanceApiInfoProvider),
  };
};

const loadBinanceClient = (apiInfoProvider?: ApiInfoProvider): Client | undefined => {
  if (!apiInfoProvider) {
    return undefined;
  }

  const client = new Client({ apiInfoProvider: apiInfoProvider });
  client.onHttpRequest((httpRequest) =>
    logger.info(
      {
        request: httpRequest,
      },
      'Executing Binance HTTP request',
    ),
  );
  client.onHttpResponse((httpRequest, httpResponse) =>
    logger.info(
      {
        request: httpRequest,
        response: httpResponse,
      },
      'Binance HTTP request executed',
    ),
  );

  return client;
};
