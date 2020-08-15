import { createElement } from '~/helpers';

abstract class Abstract {
  abstract get template(): string;

  #element: Element | null;

  constructor() {
    if (new.target === Abstract) {
      throw new Error(`Can't instantiate Abstract, only concrete one.`);
    }

    this.#element = null;
  }

  get node() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  public removeElement() {
    this.#element = null;
  }
}

export default Abstract;
