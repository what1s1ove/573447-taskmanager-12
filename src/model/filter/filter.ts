import { Observer } from '~/helpers';
import { FilterType, UpdateType } from '~/common/enums';

class Filter extends Observer<FilterType> {
  #activeFilter: FilterType;

  constructor() {
    super();

    this.#activeFilter = FilterType.ALL;
  }

  setFilter(type: UpdateType, filter: FilterType) {
    this.#activeFilter = filter;

    this.notify(type, filter);
  }

  getFilter() {
    return this.#activeFilter;
  }
}

export default Filter;
