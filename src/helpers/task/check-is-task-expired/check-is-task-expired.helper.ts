import { getCurrentDate } from '~/helpers/date';
import { TaskDueDate } from '~/common/types';

const checkIsTaskExpired = (taskDueDate: TaskDueDate) => {
  if (!taskDueDate) {
    return false;
  }

  const dueDate = new Date(taskDueDate);
  const currentDate = getCurrentDate();

  const isExpired = currentDate.getTime() > dueDate.getTime();

  return isExpired;
};

export { checkIsTaskExpired };
