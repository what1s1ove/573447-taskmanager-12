import { INewTask } from '~/common/types';

interface IRawTask extends INewTask {
  isDueDate?: boolean;
  isRepeating?: boolean;
  isDisabled: boolean;
  isSaving: boolean;
  isDeleting: boolean;
}

export { IRawTask };
