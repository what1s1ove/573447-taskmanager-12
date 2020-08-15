import { createElement } from '~/helpers';
import { BindingCb, BindingCbWithOne } from '~/common/types';

type CallBacks = Record<string, BindingCb | BindingCbWithOne<any>>;

abstract class Abstract {
  abstract get template(): string;

  protected element: Element | null;

  protected callbacks: CallBacks;

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
