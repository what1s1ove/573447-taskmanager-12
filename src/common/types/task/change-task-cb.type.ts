import { ITask } from '~/common/interfaces/task/task.interface';
import { UserAction, UpdateType } from '~/common/enums';
import { BindingCbWithThree } from '../callback';

type ChangeTaskCb = BindingCbWithThree<UserAction, UpdateType, ITask>;

export { ChangeTaskCb };
