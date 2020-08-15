import AbstractView from '~/view/abstract/abstract';
import { SortType } from '~/common/enums';

class Sort extends AbstractView {
  #sorts: SortType[];

  constructor(sorts: SortType[]) {
    super();
    this.#sorts = sorts;
  }

  get template() {
    const sortTemplates = this.#sorts.reduce((acc, it) => (acc.concat(`
      <a href="#" class="board__filter">SORT BY ${it}</a>
    `)), ``);

    return `
      <div class="board__filter-list">
        ${sortTemplates}
      </div>
    `;
  }
}

export default Sort;
