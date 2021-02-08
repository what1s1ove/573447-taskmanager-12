import { ISyncTaskPayload } from '~/common/interfaces/task/sync-task-payload.interface';

type SyncTasksResponse = {
  created: ISyncTaskPayload[];
  updated: ISyncTaskPayload[];
  deleted: ISyncTaskPayload[];
};

export { SyncTasksResponse };
