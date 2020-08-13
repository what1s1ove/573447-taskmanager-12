import { TaskColor } from '~/common/enums';
import { TASK_DEFAULT_REPEATING } from '~/common/constants';
import { ITask } from '~/common/interfaces';

const EMPTY_TASK: ITask = {
  color: TaskColor.BLACK,
  description: ``,
  dueDate: null,
  repeating: {
    ...TASK_DEFAULT_REPEATING,
  },
  isArchive: false,
  isFavorite: false,
};

enum TaskTemplateMode {
  PREVIEW = `preview`,
  EDIT = `edit`,
}

export { EMPTY_TASK, TaskTemplateMode };
