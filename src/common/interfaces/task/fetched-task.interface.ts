import { TaskColor } from '~/common/enums';
import { ITaskRepeating } from './task-repeating.interface';

interface IFetchedTask {
  id: number;
  description: string;
  due_date: string;
  repeating_days: ITaskRepeating;
  color: TaskColor;
  is_archived: boolean;
  is_favorite: boolean;
}

export { IFetchedTask };
