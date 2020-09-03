import { INewTask } from '~/common/types';

interface IRawTask extends INewTask {
  isDueDate?: boolean;
  isRepeating?: boolean;
}

export { IRawTask };
