import { checkIsTaskRepeating } from '~/helpers/task';
import { ITask } from '~/common/interfaces';

const filterTaskByRepeatingCb = (task: ITask) => {
  const isSuit = !task.isArchive && checkIsTaskRepeating(task.repeating);

  return isSuit;
};

export { filterTaskByRepeatingCb };
