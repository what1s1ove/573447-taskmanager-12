import {
  filterTaskByAllCb,
  filterTaskByOverdueCb,
  filterTaskByTodayCb,
  filterTaskByFavoritesCb,
  filterTaskByRepeatingCb,
  filterTaskByArchiveCb,
} from '~/helpers/filter';
import { ITask, IFilter } from '~/common/interfaces';
import { FilterType } from '~/common/enums';

const taskToFilterMap = {
  [FilterType.ALL]: (tasks: ITask[]) => tasks.filter(filterTaskByAllCb).length,
  [FilterType.OVERDUE]: (tasks: ITask[]) => tasks.filter(filterTaskByOverdueCb).length,
  [FilterType.TODAY]: (tasks: ITask[]) => tasks.filter(filterTaskByTodayCb).length,
  [FilterType.FAVORITES]: (tasks: ITask[]) => tasks.filter(filterTaskByFavoritesCb).length,
  [FilterType.REPEATING]: (tasks: ITask[]) => tasks.filter(filterTaskByRepeatingCb).length,
  [FilterType.ARCHIVE]: (tasks: ITask[]) => tasks.filter(filterTaskByArchiveCb).length,
};

const generateFilters = (tasks: ITask[]): IFilter[] => {
  const filters = Object.entries(taskToFilterMap).map(
    ([filterName, countTasks]) => ({
      type: filterName as FilterType,
      count: countTasks(tasks),
    })
  );

  return filters;
};

export { generateFilters };
