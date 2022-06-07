import Keyv, { Store } from 'keyv';

export class MemoryCache<T> {
  private store: Store<T>;

  constructor(ttl: number) {
    if (ttl < 0) {
      throw new Error(`Invalid memory cache TTL: ${ttl}`);
    }

    this.store = new Keyv({ ttl: ttl > 0 ? ttl : undefined });
  }

  async getAndSet(key: string, source: () => Promise<T>): Promise<T> {
    const value = await this.#get(key);
    if (value) {
      return value;
    }

    return source().then(async (value) => {
      await this.#set(key, value);
      return value;
    });
  }

  async #set(key: string, value: T): Promise<void> {
    await this.store.set(key, value);
  }

  async #get(key: string): Promise<T | null> {
    const value = await this.store.get(key);

    return value !== null && value !== undefined ? value : null;
  }
}
