import { ITask } from '~/common/interfaces';
import { IStorage } from './common';

class Store<T extends IStorage> {
  #storage: T;

  #storeKey: string;

  constructor(key: string, storage: T) {
    this.#storage = storage;
    this.#storeKey = key;
  }

  getItems() {
    try {
      return JSON.parse(this.#storage.getItem(this.#storeKey)) || {};
    } catch (err) {
      return {};
    }
  }

  setItems(items: ITask) {
    this.#storage.setItem(this.#storeKey, JSON.stringify(items));
  }

  setItem<T>(key: string, value: T) {
    const store = this.getItems();

    this.#storage.setItem(
      this.#storeKey,
      JSON.stringify({ ...store, [key]: value })
    );
  }

  removeItem(key: string) {
    const store = this.getItems();

    delete store[key];

    this.#storage.setItem(this.#storeKey, JSON.stringify(store));
  }
}

export default Store;
