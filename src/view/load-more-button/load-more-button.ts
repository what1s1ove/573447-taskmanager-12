import { createElement } from '~/helpers/dom/index';

class LoadMoreButton {
  #element: Element | null = null;

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

  removeElement() {
    this.#element = null;
  }
}

export default LoadMoreButton;
