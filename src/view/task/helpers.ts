import { TaskDueDate } from '~/common/types';

const isExpired = (taskDueDate: TaskDueDate) => {
  if (!taskDueDate) {
    return false;
  }

  const DueDate = new Date(taskDueDate);
  let currentDate = new Date();

  currentDate.setHours(23, 59, 59, 999);
  currentDate = new Date(currentDate);

  return currentDate.getTime() > DueDate.getTime();
};

export { isExpired };
