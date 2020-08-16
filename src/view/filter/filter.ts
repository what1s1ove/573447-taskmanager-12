import AbstractView from '~/view/abstract/abstract';
import { IFilter } from '~/common/interfaces';
import { FilterType } from '~/common/enums';
import { createFilterItemTemplate } from './templates/filter-item/filter-item';

class Filter extends AbstractView {
  #filters: IFilter[];

  constructor(filters: IFilter[]) {
    super();
    this.#filters = filters;
  }

  get template() {
    const filterItemsTemplates = this.#filters.reduce((acc, it) => (acc.concat(
      createFilterItemTemplate(it, it.name === FilterType.ALL)
    )), ``);

    return `
      <section class="main__filter filter container">
        ${filterItemsTemplates}
      </section>
    `;
  }
}

export default Filter;
