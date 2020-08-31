import { checkIsTaskRepeating } from '~/helpers';
import { ITask } from '~/common/interfaces';
import { TASK_DEFAULT_REPEATING } from '~/common/constants';
import { IRawTask } from './common';

const getClearTask = (task: IRawTask): ITask => {
  const { isDueDate, isRepeating, ...rest } = task;

  return {
    ...rest,
    dueDate: isDueDate ? rest.dueDate : null,
    repeating: isRepeating ? rest.repeating : TASK_DEFAULT_REPEATING,
  };
};

const getRawTask = (task: ITask): IRawTask => {
  const parsedData = {
    ...task,
    isDueDate: task.dueDate !== null,
    isRepeating: checkIsTaskRepeating(task.repeating),
  };

  return parsedData;
};

export { getClearTask, getRawTask };
