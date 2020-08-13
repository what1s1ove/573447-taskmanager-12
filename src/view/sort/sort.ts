import { createElement } from '~/helpers/dom';
import { SortType } from '~/common/enums';

class Sort {
  #element: Element | null;

  #sorts: SortType[];

  constructor(sorts: SortType[]) {
    this.#sorts = sorts;
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
      <div class="board__filter-list">
        ${this.#sorts.reduce((acc, it) => (acc.concat(`
          <a href="#" class="board__filter">SORT BY ${it}</a>
        `)), ``)}
      </div>
    `;
  }

  public removeElement = () => {
    this.#element = null;
  };
}

export default Sort;
