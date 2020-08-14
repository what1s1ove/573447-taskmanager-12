import { createElement } from '~/helpers';
import { IFilter } from '~/common/interfaces';
import { FilterType } from '~/common/enums';

class Filter {
  #element: Element | null;

  #filters: IFilter[];

  constructor(filters: IFilter[]) {
    this.#filters = filters;
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
  <section class="main__filter filter container">
    ${this.#filters.reduce((acc, it) => (acc.concat(
      this.#getFilterItemTemplate(it, it.name === FilterType.ALL)
    )), ``)}
  </section>
    `;
  }

  #getFilterItemTemplate = (filter: IFilter, isChecked: boolean) => {
    const { name, count } = filter;
    const isDisabled = count === 0;

    return `
      <input
        type="radio"
        id="filter__${name}"
        class="filter__input visually-hidden"
        name="filter"
        ${isChecked ? `checked` : ``}
        ${isDisabled ? `disabled` : ``}
      />
      <label for="filter__${name}" class="filter__label">
        ${name}
        <span class="filter__${name}-count">
          ${count}
        </span>
      </label>
    `;
  };

  public removeElement = () => {
    this.#element = null;
  };
}

export default Filter;
