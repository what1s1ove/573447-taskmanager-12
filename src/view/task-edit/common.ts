import { INewTask } from '~/common/types';
import { TaskColor } from '~/common/enums';
import { TASK_DEFAULT_REPEATING } from '~/common/constants';

const EMPTY_TASK: INewTask = {
  color: TaskColor.BLACK,
  description: ``,
  dueDate: null,
  repeating: {
    ...TASK_DEFAULT_REPEATING,
  },
  isArchive: false,
  isFavorite: false,
};

export { EMPTY_TASK };
