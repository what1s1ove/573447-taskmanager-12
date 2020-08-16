import { createElement } from '~/helpers/render/create-element/create-element.helper';
import { AnyCb } from '~/common/types';

abstract class Abstract {
  abstract get template(): string;

  protected element: Element | null;

  protected callbacks: Record<string, AnyCb>;

  constructor() {
    if (new.target === Abstract) {
      throw new Error(`Can't instantiate Abstract, only concrete one.`);
    }

    this.element = null;

    this.callbacks = {};
  }

  get node() {
    if (!this.element) {
      this.element = createElement(this.template);
    }

    return this.element;
  }

  public removeElement() {
    this.element = null;
  }
}

export default Abstract;
