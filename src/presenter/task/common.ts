import { ITask } from '~/common/interfaces';
import { UserAction, UpdateType } from '~/common/enums';
import { BindingCbWithThree } from '~/common/types';

enum TaskMode {
  PREVIEW = `preview`,
  EDIT = `edit`,
}

type ChangeTaskCb = BindingCbWithThree<UserAction, UpdateType, ITask>;

export { TaskMode, ChangeTaskCb };
