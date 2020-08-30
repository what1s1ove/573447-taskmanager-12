import { UpdateType } from '~/common/enums';
import { BindingCbWithTwo } from '~/common/types';
import { ITask } from '~/common/interfaces';

type TaskObserverCb = BindingCbWithTwo<UpdateType, ITask>;

class Observer {
  #observers: TaskObserverCb[];

  constructor() {
    this.#observers = [];
  }

  protected notify = (event: UpdateType, payload: ITask) => {
    this.#observers.forEach((observer) => observer(event, payload));
  };

  public addObserver(observer: TaskObserverCb) {
    this.#observers.push(observer);
  }

  public removeObserver(observer: TaskObserverCb) {
    this.#observers = this.#observers.filter(
      (existedObserver) => existedObserver !== observer
    );
  }
}

export default Observer;
