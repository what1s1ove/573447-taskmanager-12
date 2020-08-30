import { ITask } from '~/common/interfaces';
import { UserAction, UpdateType } from '~/common/enums';
import { BindingCbWithThree } from '~/common/types';

type ChangeTaskCb = BindingCbWithThree<UserAction, UpdateType, ITask>;

export { ChangeTaskCb };
