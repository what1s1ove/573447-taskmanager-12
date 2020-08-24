import { checkIsTaskRepeating } from '~/helpers';
import { ITask } from '~/common/interfaces';
import { TASK_DEFAULT_REPEATING } from '~/common/constants';
import { IRawTask } from './common';

const getClearTask = (task: IRawTask): ITask => {
  const parsedTask = { ...task };

  if (!parsedTask.isDueDate) {
    parsedTask.dueDate = null;
  }

  if (!parsedTask.isRepeating) {
    parsedTask.repeating = TASK_DEFAULT_REPEATING;
  }

  delete parsedTask.isDueDate;
  delete parsedTask.isRepeating;

  return parsedTask;
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
