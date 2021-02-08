import { IFetchedTask, ISyncTaskPayload } from '~/common/interfaces';
import { StoredTasks } from '~/common/types';

const getSyncedTasks = (items: ISyncTaskPayload[]) => {
  const syncedTasks = items.reduce(
    (acc, it) => (it.success ? [...acc, it.payload] : acc),
    []
  );

  return syncedTasks;
};

const createStoreStructure = (items: IFetchedTask[]) => {
  const storeStructure = items.reduce(
    (acc, it) => ({
      ...acc,
      [it.id]: it,
    }),
    {} as StoredTasks
  );

  return storeStructure;
};

export { getSyncedTasks, createStoreStructure };
