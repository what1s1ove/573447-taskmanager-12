import { ITask } from '~/common/interfaces';

const filterTaskByFavoritesCb = (task: ITask) => {
  const isSuit = !task.isArchive && task.isFavorite;

  return isSuit;
};

export { filterTaskByFavoritesCb };
