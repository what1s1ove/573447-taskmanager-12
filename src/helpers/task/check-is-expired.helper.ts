import { TaskDueDate } from '~/common/types';
import { getCurrentDate } from '../date';

const checkIsExpired = (taskDueDate: TaskDueDate) => {
  if (!taskDueDate) {
    return false;
  }

  const dueDate = new Date(taskDueDate);
  const currentDate = getCurrentDate();

  const isExpired = currentDate.getTime() > dueDate.getTime();

  return isExpired;
};

export { checkIsExpired };
