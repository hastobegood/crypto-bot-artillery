import { MemoryCache } from '../../../../src/common/cache/memory-cache';

let memoryCache: MemoryCache<string>;

describe('MemoryCache', () => {
  describe('Give a store with a negative TTL', () => {
    describe('Then error is thrown', () => {
      try {
        memoryCache = new MemoryCache(-1);
        fail();
      } catch (error) {
        expect((error as Error).message).toEqual('Invalid memory cache TTL: -1');
      }
    });
  });

  describe('Give a store with a zero TTL', () => {
    beforeEach(() => {
      memoryCache = new MemoryCache(0);
    });

    describe('When value was not already cached', () => {
      it('Then value is retrieved from source and then cached', async () => {
        const sourceMock = jest.fn().mockResolvedValue('value');

        let result = await memoryCache.getAndSet('1', sourceMock);
        expect(result).toEqual('value');
        result = await memoryCache.getAndSet('1', sourceMock);
        expect(result).toEqual('value');

        await new Promise((resolve) => setTimeout(resolve, 200 + 10));

        result = await memoryCache.getAndSet('1', sourceMock);
        expect(result).toEqual('value');

        expect(sourceMock).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Give a store with a positive TTL', () => {
    beforeEach(() => {
      memoryCache = new MemoryCache(200);
    });

    describe('When value was not already cached', () => {
      it('Then value is retrieved from source and then cached', async () => {
        const sourceMock = jest.fn().mockResolvedValue('value');

        let result = await memoryCache.getAndSet('1', sourceMock);
        expect(result).toEqual('value');
        result = await memoryCache.getAndSet('1', sourceMock);
        expect(result).toEqual('value');

        await new Promise((resolve) => setTimeout(resolve, 200 + 10));

        result = await memoryCache.getAndSet('1', sourceMock);
        expect(result).toEqual('value');

        expect(sourceMock).toHaveBeenCalledTimes(2);
      });
    });
  });
});
