import { ITask } from '~/common/interfaces/task/task.interface';
import { UserAction, UpdateType } from '~/common/enums';
import { BindingCbWithThree } from '../callback';
import { INewTask } from './new-task.type';

type ChangeTaskCb = BindingCbWithThree<UserAction, UpdateType, ITask | INewTask>;

export { ChangeTaskCb };
