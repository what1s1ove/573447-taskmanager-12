import { TaskColor } from '~/common/enums';
import { TASK_DEFAULT_REPEATING } from '~/common/constants';
import { ITask } from '~/common/interfaces';
import { getRandomId } from '~/helpers';

const EMPTY_TASK: ITask = {
  id: getRandomId(),
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
