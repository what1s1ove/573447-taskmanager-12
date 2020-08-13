import { createElement } from '~/helpers';

class Board {
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
      <section class="board container"></section>
    `;
  }

  public removeElement = () => {
    this.#element = null;
  };
}

export default Board;
