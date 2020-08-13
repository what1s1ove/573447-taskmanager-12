import { createElement } from '~/helpers/dom/index';

class TaskList {
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
      <div class="board__tasks"></div>
    `;
  }

  public removeElement = () => {
    this.#element = null;
  };
}

export default TaskList;
