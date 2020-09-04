import { ITask } from '~/common/interfaces/task/task.interface';

type INewTask = Omit<ITask, 'id'>;

export { INewTask };
