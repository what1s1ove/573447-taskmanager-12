import { BindingCbWithOne } from '~/common/types';
import { ITask } from '~/common/interfaces';

enum TaskMode {
  PREVIEW = `preview`,
  EDIT = `edit`,
}

type ChangeTaskCb = BindingCbWithOne<ITask>;

export { TaskMode, ChangeTaskCb };
