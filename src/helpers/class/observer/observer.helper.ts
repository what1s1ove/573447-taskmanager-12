import Abstract from '~/view/abstract/abstract';

class Observer {
  #observers: Abstract[];

  constructor() {
    this.#observers = [];
  }

  #notify = (event, payload) => {
    this.#observers.forEach((observer) => observer(event, payload));
  };

  public addObserver(observer: Abstract) {
    this.#observers.push(observer);
  }

  public removeObserver(observer: Abstract) {
    this.#observers = this.#observers.filter(
      (existedObserver) => existedObserver !== observer
    );
  }
}

export default Observer;
