import { ITask } from '~/common/interfaces';

const filterTaskByAllCb = (task: ITask) => {
  const isSuit = !task.isArchive;

  return isSuit;
};

export { filterTaskByAllCb };
