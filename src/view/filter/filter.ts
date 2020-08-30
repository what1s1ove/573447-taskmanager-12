import AbstractView from '~/view/abstract/abstract';
import { IFilter } from '~/common/interfaces';
import { FilterType } from '~/common/enums';
import { createFilterItemTemplate } from './templates/filter-item/filter-item';
import { BindingCbWithOne } from '~/common/types';

type CallBacks = {
  onFilterChange: BindingCbWithOne<FilterType>;
};

type Constructor = {
  filters: IFilter[];
  currentFilter: FilterType;
};

class Filter extends AbstractView {
  protected callbacks: CallBacks;

  #filters: IFilter[];

  #currentFilter: FilterType;

  constructor({ filters, currentFilter }: Constructor) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilter;
  }

  get template() {
    const filterItemsTemplates = this.#filters.reduce((acc, it) => (acc.concat(
      createFilterItemTemplate(it, it.name === this.#currentFilter)
    )), ``);

    return `
      <section class="main__filter filter container">
        ${filterItemsTemplates}
      </section>
    `;
  }

  #onFilterChange = ({ target }: Event) => {
    this.callbacks.onFilterChange(
      (target as HTMLInputElement).value as FilterType
    );
  };

  setOnChangeFilter = (callback: BindingCbWithOne<FilterType>) => {
    this.callbacks.onFilterChange = callback;

    this.node.addEventListener(`change`, this.#onFilterChange);
  };
}

export default Filter;
