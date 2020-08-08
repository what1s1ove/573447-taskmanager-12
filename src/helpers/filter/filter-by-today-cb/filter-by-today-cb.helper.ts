import { checkIsTaskExpiringToday } from '~/helpers/task';
import { ITask } from '~/common/interfaces';

const filterTaskByTodayCb = (task: ITask) => {
  const isSuit = !task.isArchive && checkIsTaskExpiringToday(task.dueDate);

  return isSuit;
};

export { filterTaskByTodayCb };
