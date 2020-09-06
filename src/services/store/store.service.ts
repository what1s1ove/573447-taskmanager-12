import { StoredTasks } from '~/common/types';

type Constructor = {
  key: string,
  storage: Storage
};

class Store {
  #storage: Storage;

  #storeKey: string;

  constructor({ key, storage }: Constructor) {
    this.#storage = storage;
    this.#storeKey = key;
  }

  public getItems(): StoredTasks {
    try {
      return JSON.parse(this.#storage.getItem(this.#storeKey)) || {};
    } catch (err) {
      return {};
    }
  }

  public setItems(items: StoredTasks) {
    this.#storage.setItem(this.#storeKey, JSON.stringify(items));
  }

  public setItem<T>(key: string | number, value: T) {
    const store = this.getItems();

    this.#storage.setItem(
      this.#storeKey,
      JSON.stringify({ ...store, [key]: value })
    );
  }

  public removeItem(key: string | number) {
    const store = this.getItems();

    delete store[key];

    this.#storage.setItem(this.#storeKey, JSON.stringify(store));
  }
}

export default Store;
