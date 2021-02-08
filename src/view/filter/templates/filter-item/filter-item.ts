import { IFilter } from '~/common/interfaces';

const createFilterItemTemplate = (filter: IFilter, isChecked: boolean) => {
  const { type, count } = filter;
  const isDisabled = count === 0;

  return `
    <input
      type="radio"
      id="filter__${type}"
      class="filter__input visually-hidden"
      name="filter"
      value="${type}"
      ${isChecked ? `checked` : ``}
      ${isDisabled ? `disabled` : ``}
    />
    <label for="filter__${type}" class="filter__label">
      ${type}
      <span class="filter__${type}-count">
        ${count}
      </span>
    </label>
  `;
};

export { createFilterItemTemplate };
