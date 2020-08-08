import { TaskDueDate } from '~/common/types';

const checkIsExpired = (taskDueDate: TaskDueDate) => {
  if (!taskDueDate) {
    return false;
  }

  const dueDate = new Date(taskDueDate);
  let currentDate = new Date();

  currentDate.setHours(23, 59, 59, 999);
  currentDate = new Date(currentDate);

  const isExpired = currentDate.getTime() > dueDate.getTime();

  return isExpired;
};

export { checkIsExpired };
