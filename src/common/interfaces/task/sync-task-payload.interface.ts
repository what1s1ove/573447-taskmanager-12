import { ITask } from './task.interface';

interface ISyncTaskPayload {
  errors: string[];
  payload: ITask;
  success: boolean;
}

export { ISyncTaskPayload };
