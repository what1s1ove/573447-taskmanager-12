import { TaskDueDate } from '~/common/types';

const getRankByDate = (dateA: TaskDueDate, dateB: TaskDueDate) => {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
};

export { getRankByDate };
