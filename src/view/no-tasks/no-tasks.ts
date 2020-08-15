import { createElement } from '~/helpers';

class NoTask {
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
      <p class="board__no-tasks">
        Click «ADD NEW TASK» in menu to create your first task
      </p>
    `;
  }

  public removeElement() {
    this.#element = null;
  }
}

export default NoTask;
