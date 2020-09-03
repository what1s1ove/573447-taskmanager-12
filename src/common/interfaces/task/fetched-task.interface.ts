import { TaskColor } from '~/common/enums';
import { TaskDueDate } from '~/common/types/task/task-due-date.type';
import { ITaskRepeating } from './task-repeating.interface';

interface IFetchedTask {
  id: number;
  description: string;
  due_date: TaskDueDate;
  repeating: ITaskRepeating;
  color: TaskColor;
  is_archive: boolean;
  is_favorite: boolean;
}

export { IFetchedTask };
