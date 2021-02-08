import { getCurrentDate } from '~/helpers/date';
import { TaskDueDate } from '~/common/types';

const checkIsTaskExpiringToday = (taskDueDate: TaskDueDate) => {
  if (!taskDueDate) {
    return false;
  }

  const currentDate = getCurrentDate();
  const dueDate = new Date(taskDueDate);

  const isTaskExpiringToday = currentDate.getTime() === dueDate.getTime();

  return isTaskExpiringToday;
};

export { checkIsTaskExpiringToday };
