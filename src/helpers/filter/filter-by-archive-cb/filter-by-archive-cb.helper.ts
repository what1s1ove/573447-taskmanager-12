import { ITask } from '~/common/interfaces';

const filterTaskByArchiveCb = (task: ITask) => {
  const isSuit = task.isArchive;

  return isSuit;
};

export { filterTaskByArchiveCb };
