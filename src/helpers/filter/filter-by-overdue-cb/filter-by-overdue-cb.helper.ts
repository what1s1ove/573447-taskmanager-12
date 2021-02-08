import { checkIsTaskExpired } from '~/helpers/task';
import { ITask } from '~/common/interfaces';

const filterTaskByOverdueCb = (task: ITask) => {
  const isSuit = !task.isArchive && checkIsTaskExpired(task.dueDate);

  return isSuit;
};

export { filterTaskByOverdueCb };
