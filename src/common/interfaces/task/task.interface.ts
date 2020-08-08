import { TaskColor } from '~/common/enums';
import { TaskDueDate } from '~/common/types';
import { ITaskRepeating } from './task-repeating.interface';

interface ITask {
  description: string;
  dueDate: TaskDueDate;
  repeating: ITaskRepeating;
  color: TaskColor;
  isArchive: boolean;
  isFavorite: boolean;
}

export { ITask };
