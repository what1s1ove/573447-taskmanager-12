import AbstractView from '~/view/abstract/abstract';
import { SortType } from '~/common/enums';
import { BindingCbWithOne } from '~/common/types';

const SORT_DATA_ATTR = `data-sort-type`;

type ChangeSortTypeCb = BindingCbWithOne<SortType>;

type CallBacks = {
  changeSortType: ChangeSortTypeCb;
};

class Sort extends AbstractView {
  protected callbacks: CallBacks;

  #sorts: SortType[];

  constructor(sorts: SortType[]) {
    super();
    this.#sorts = sorts;
  }

  get template() {
    const sortTemplates = this.#sorts.reduce((acc, it) => (acc.concat(`
      <a
        href="#"
        class="board__filter"
        ${SORT_DATA_ATTR}="${it}"
      >
        SORT BY ${it}
      </a>
    `)), ``);

    return `
      <div class="board__filter-list">
        ${sortTemplates}
      </div>
    `;
  }

  #onSortTypeChange = (evt: Event) => {
    const target = (evt.target as HTMLAnchorElement);

    const hasAttr = target.hasAttribute(SORT_DATA_ATTR);

    if (!hasAttr) {
      return;
    }

    this.callbacks.changeSortType(target.getAttribute(SORT_DATA_ATTR) as SortType);
  };

  public setOnSortTypeChange = (callback: ChangeSortTypeCb) => {
    this.callbacks.changeSortType = callback;

    this.node.addEventListener(`click`, this.#onSortTypeChange);
  };
}

export default Sort;
