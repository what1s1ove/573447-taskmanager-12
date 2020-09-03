import FilterView from '~/view/filter/filter';
import FilterModel from '~/model/filter/filter';
import TaskModel from '~/model/task/task';
import { FilterType, RenderPosition, UpdateType } from '~/common/enums';
import { IFilter } from '~/common/interfaces';
import { filterToCbMap } from '~/common/maps';
import { renderElement, removeElement, replaceWithElement } from '~/helpers';

const filters = Object.values(FilterType);

type Constructor = {
  containerNode: Element;
  filterModel: FilterModel;
  tasksModel: TaskModel;
};

class Filter {
  #filterContainer: Element;

  #filterModel: FilterModel;

  #tasksModel: TaskModel;

  #currentFilter: FilterType | null;

  #filterComponent: FilterView | null;

  constructor({ containerNode, filterModel, tasksModel }: Constructor) {
    this.#filterContainer = containerNode;
    this.#filterModel = filterModel;
    this.#tasksModel = tasksModel;
    this.#currentFilter = null;

    this.#filterComponent = null;

    this.#tasksModel.addObserver(this.#changeModelEvent);
    this.#filterModel.addObserver(this.#changeModelEvent);
  }

  #changeModelEvent = () => {
    this.init();
  };

  #changeFilterType = (filterType: FilterType) => {
    if (this.#currentFilter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };

  #getFilterEntities = (): IFilter[] => {
    const { tasks } = this.#tasksModel;

    const filterEntities = filters.map((it) => ({
      type: it,
      count: filterToCbMap[it](tasks).length,
    }));

    return filterEntities;
  };

  public init() {
    this.#currentFilter = this.#filterModel.filter;

    const filterEntities = this.#getFilterEntities();
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView({
      filters: filterEntities,
      currentFilter: this.#currentFilter
    });

    this.#filterComponent.setOnChangeFilter(this.#changeFilterType);

    if (!prevFilterComponent) {
      renderElement(
        this.#filterContainer,
        this.#filterComponent,
        RenderPosition.BEFORE_END
      );

      return;
    }

    replaceWithElement(prevFilterComponent, this.#filterComponent,);

    removeElement(prevFilterComponent);
  }
}

export default Filter;
