import {
  filterTaskByAllCb,
  filterTaskByOverdueCb,
  filterTaskByTodayCb,
  filterTaskByFavoritesCb,
  filterTaskByRepeatingCb,
  filterTaskByArchiveCb,
} from '~/helpers/filter';
import { ITask } from '~/common/interfaces';
import { FilterType } from '~/common/enums';

const filterToCbMap = {
  [FilterType.ALL]: (tasks: ITask[]) => tasks.filter(filterTaskByAllCb),
  [FilterType.OVERDUE]: (tasks: ITask[]) => tasks.filter(filterTaskByOverdueCb),
  [FilterType.TODAY]: (tasks: ITask[]) => tasks.filter(filterTaskByTodayCb),
  [FilterType.FAVORITES]: (tasks: ITask[]) => tasks.filter(filterTaskByFavoritesCb),
  [FilterType.REPEATING]: (tasks: ITask[]) => tasks.filter(filterTaskByRepeatingCb),
  [FilterType.ARCHIVE]: (tasks: ITask[]) => tasks.filter(filterTaskByArchiveCb),
};

export { filterToCbMap };
