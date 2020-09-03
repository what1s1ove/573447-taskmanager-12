import { checkIsTaskRepeating } from '~/helpers';
import { ITask, IRawTask } from '~/common/interfaces';
import { TASK_DEFAULT_REPEATING } from '~/common/constants';
import { INewTask } from '~/common/types';

const getClearTask = (task: IRawTask): ITask | INewTask => {
  const { isDueDate, isRepeating, ...rest } = task;

  const parsedData = {
    ...rest,
    dueDate: isDueDate ? rest.dueDate : null,
    repeating: isRepeating ? rest.repeating : TASK_DEFAULT_REPEATING,
  };

  delete parsedData.isDisabled;
  delete parsedData.isSaving;
  delete parsedData.isDeleting;

  return parsedData;
};

const getRawTask = (task: ITask | INewTask): IRawTask => {
  const parsedData = {
    ...task,
    isDueDate: task.dueDate !== null,
    isRepeating: checkIsTaskRepeating(task.repeating),
    isDisabled: false,
    isSaving: false,
    isDeleting: false,
  };

  return parsedData;
};

export { getClearTask, getRawTask };
