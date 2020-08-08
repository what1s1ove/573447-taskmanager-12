import { IFilter } from '~/common/interfaces';
import { FilterType } from '~/common/enums';
import { createFilterItemTemplate } from './templates/filter-item/filter-item';

const createFilterTemplate = (filters: IFilter[]) => {
  const filterItemsTemplate = filters
    .map((filter) => {
      const isDefaultCheck = filter.name === FilterType.ALL;

      return createFilterItemTemplate(filter, isDefaultCheck);
    })
    .join(``);

  return `
    <section class="main__filter filter container">
      ${filterItemsTemplate}
    </section>
  `;
};

export { createFilterTemplate };
