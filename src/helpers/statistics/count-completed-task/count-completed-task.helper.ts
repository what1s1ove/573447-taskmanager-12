import moment from 'moment';
import { ITask } from '~/common/interfaces';

export const countCompletedTasks = (
  tasks: ITask[],
  dateFrom: Date,
  dateTo: Date
) => tasks.reduce((acc, task) => {
  if (!task.dueDate) {
    return acc;
  }

  const isSuit = moment(task.dueDate).isSame(dateFrom)
    || moment(task.dueDate).isBetween(dateFrom, dateTo)
    || moment(task.dueDate).isSame(dateTo);

  if (isSuit) {
    return acc + 1;
  }

  return acc;
}, 0);
