import { ITask } from '~/common/interfaces';

type INewTask = Omit<ITask, 'id'>;

export { INewTask };
