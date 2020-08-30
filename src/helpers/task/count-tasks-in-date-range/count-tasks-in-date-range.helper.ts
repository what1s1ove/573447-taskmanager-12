import { ITask } from '~/common/interfaces';
import { checkIsDatesEqual } from '~/helpers/date';

const countTasksInDateRange = (dates: Date[], tasks: ITask[]) => {
  const tasksInDateRange = dates.map(
    (date) => tasks.filter((task) => checkIsDatesEqual(task.dueDate, date)).length
  );

  return tasksInDateRange.length;
};

export { countTasksInDateRange };
