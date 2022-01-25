import { toBinanceSymbol } from '../../../../../../src/common/exchanges/binance/binance-converter.js';
import { FetchTicker } from '../../../../../../src/ticker/domain/model/ticker.js';
import { buildDefaultFetchTicker } from '../../../../../builders/ticker/domain/ticker-test-builder.js';
import { Client, GetExchangeInfoOutput } from '@hastobegood/crypto-clients-binance';
import { BinanceTickerClient } from '../../../../../../src/ticker/infrastructure/exchanges/binance/binance-ticker-client.js';
import {
  buildBinanceGetExchangeInfoOutputSymbolLotSizeFilter,
  buildBinanceGetExchangeInfoOutputSymbolPriceFilter,
  buildDefaultBinanceGetExchangeInfoOutput,
} from '../../../../../builders/ticker/infrastructure/exchanges/binance/binance-ticker-test-builder.js';

const clientMock = jest.mocked(jest.genMockFromModule<Client>('@hastobegood/crypto-clients-binance'), true);

let binanceTickerClient: BinanceTickerClient;
beforeEach(() => {
  clientMock.send = jest.fn();

  binanceTickerClient = new BinanceTickerClient(clientMock);
});

describe('BinanceTickerClient', () => {
  describe('Given the exchange to retrieve', () => {
    it('Then Binance exchange is returned', async () => {
      expect(binanceTickerClient.getExchange()).toEqual('Binance');
    });
  });

  describe('Given a ticker to fetch', () => {
    let fetchTicker: FetchTicker;
    let getExchangeInfoOutput: GetExchangeInfoOutput;

    beforeEach(() => {
      fetchTicker = buildDefaultFetchTicker();
    });

    describe('When ticker is found', () => {
      beforeEach(() => {
        getExchangeInfoOutput = buildDefaultBinanceGetExchangeInfoOutput();
        getExchangeInfoOutput.symbols[0].filters = [buildBinanceGetExchangeInfoOutputSymbolLotSizeFilter('0.00000100'), buildBinanceGetExchangeInfoOutputSymbolPriceFilter('1.00000000')];

        clientMock.send.mockResolvedValueOnce({
          status: 200,
          headers: {},
          data: getExchangeInfoOutput,
        });
      });

      it('Then ticker is returned', async () => {
        const result = await binanceTickerClient.fetchTicker(fetchTicker);
        expect(result).toEqual({
          exchange: fetchTicker.exchange,
          symbol: fetchTicker.symbol,
          baseAssetPrecision: getExchangeInfoOutput.symbols[0].baseAssetPrecision,
          quoteAssetPrecision: getExchangeInfoOutput.symbols[0].quoteAssetPrecision,
          quantityPrecision: 6,
          pricePrecision: 0,
        });

        expect(clientMock.send).toHaveBeenCalledTimes(1);
        const sendParams = clientMock.send.mock.calls[0];
        expect(sendParams.length).toEqual(1);
        expect(sendParams[0]).toEqual({
          input: {
            symbol: toBinanceSymbol(fetchTicker.symbol),
          },
        });
      });
    });
  });
});
