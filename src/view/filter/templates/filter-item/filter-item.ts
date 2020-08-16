import { IFilter } from '~/common/interfaces';

const createFilterItemTemplate = (filter: IFilter, isChecked: boolean) => {
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

export { createFilterItemTemplate };
