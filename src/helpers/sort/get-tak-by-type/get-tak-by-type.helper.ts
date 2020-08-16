import { ITask } from '~/common/interfaces';
import { SortType } from '~/common/enums';
import { getRankByDate } from '../get-rank-by-date/get-rank-by-date.helper';

const getCompare = (taskA: ITask, taskB: ITask, type: SortType) => {
  const localTaskADate = new Date(taskA.dueDate);
  const localTaskBDate = new Date(taskB.dueDate);
  let compare = null;

  switch (type) {
    case SortType.DATE_UP:
      compare = localTaskADate.getTime() - localTaskBDate.getTime();
      break;
    case SortType.DATE_DOWN:
      compare = localTaskBDate.getTime() - localTaskADate.getTime();
      break;
  }

  return compare;
};

const getRankByType = (taskA: ITask, taskB: ITask, type: SortType) => {
  const rank = getRankByDate(taskA.dueDate, taskB.dueDate);

  if (rank !== null) {
    return rank;
  }

  return getCompare(taskA, taskB, type);
};

export { getRankByType };
