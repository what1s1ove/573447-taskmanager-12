import { UpdateType } from '~/common/enums';
import { BindingCbWithTwo } from '~/common/types';

class Observer<T> {
  #observers: BindingCbWithTwo<UpdateType, T>[];

  constructor() {
    this.#observers = [];
  }

  protected notify = (event: UpdateType, payload: T) => {
    this.#observers.forEach((observer) => observer(event, payload));
  };

  public addObserver(observer: BindingCbWithTwo<UpdateType, T>) {
    this.#observers.push(observer);
  }

  public removeObserver(observer: BindingCbWithTwo<UpdateType, T>) {
    this.#observers = this.#observers.filter(
      (existedObserver) => existedObserver !== observer
    );
  }
}

export default Observer;
