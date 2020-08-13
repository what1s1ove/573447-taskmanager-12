import { createElement } from '~/helpers/dom';

class LoadMoreButton {
  #element: Element | null;

  constructor() {
    this.#element = null;
  }

  get node() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return `
      <button class="load-more" type="button">
        load more
      </button>
    `;
  }

  public removeElement() {
    this.#element = null;
  }
}

export default LoadMoreButton;
