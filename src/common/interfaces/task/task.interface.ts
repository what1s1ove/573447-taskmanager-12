import { TaskColor } from '~/common/enums';
import { TaskDueDate } from '~/common/types/task/task-due-date.type';
import { ITaskRepeating } from './task-repeating.interface';

interface ITask {
  id: number | string;
  description: string;
  dueDate: TaskDueDate;
  repeating: ITaskRepeating;
  color: TaskColor;
  isArchive: boolean;
  isFavorite: boolean;
}

export { ITask };
