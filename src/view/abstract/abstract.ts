import { createElement } from '~/helpers/render/create-element/create-element.helper';
import { AnyCb, BindingCb } from '~/common/types';

const SHAKE_ANIMATION_TIMEOUT = 600;

abstract class Abstract {
  abstract get template(): string;

  protected element: HTMLElement | null;

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

  public shake(callback: BindingCb) {
    this.node.style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    setTimeout(() => {
      this.node.style.animation = ``;
      callback();
    }, SHAKE_ANIMATION_TIMEOUT);
  }
}

export default Abstract;
