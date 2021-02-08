import { nanoid } from 'nanoid';
import TasksModel from '~/model/task/task';
import Api from '../api/api.service';
import Store from '../store/store.service';
import { ITask } from '~/common/interfaces';
import { createStoreStructure, getSyncedTasks } from './helpers';
import { INewTask } from '~/common/types';

type Constructor = {
  api: Api,
  store: Store
};

class Provider {
  #api: Api;

  #store: Store;

  constructor({ api, store }: Constructor) {
    this.#api = api;
    this.#store = store;
  }

  getTasks() {
    if (Provider.isOnline()) {
      return this.#api.getTasks().then((tasks: ITask[]) => {
        const items = createStoreStructure(tasks.map(TasksModel.adaptToServer));

        this.#store.setItems(items);

        return tasks;
      });
    }

    const storeTasks = Object.values(this.#store.getItems());

    return Promise.resolve(storeTasks.map(TasksModel.adaptToClient));
  }

  updateTask(task: ITask) {
    if (Provider.isOnline()) {
      return this.#api.updateTask(task).then((updatedTask) => {
        this.#store.setItem(
          String(updatedTask.id),
          TasksModel.adaptToServer(updatedTask)
        );

        return updatedTask;
      });
    }

    this.#store.setItem(
      String(task.id),
      TasksModel.adaptToServer({ ...task })
    );

    return Promise.resolve(task);
  }

  public addTask(task: INewTask) {
    if (Provider.isOnline()) {
      return this.#api.addTask(task).then((newTask) => {
        this.#store.setItem(newTask.id, TasksModel.adaptToServer(newTask));

        return newTask;
      });
    }

    const localNewTaskId = nanoid();
    const localNewTask = { ...task, id: localNewTaskId };

    this.#store.setItem(
      localNewTask.id,
      TasksModel.adaptToServer(localNewTask)
    );

    return Promise.resolve(localNewTask);
  }

  public deleteTask(task: ITask) {
    if (Provider.isOnline()) {
      return this.#api
        .deleteTask(task)
        .then(() => this.#store.removeItem(task.id));
    }

    this.#store.removeItem(String(task.id));

    return Promise.resolve();
  }

  public syncTasks() {
    if (Provider.isOnline()) {
      const storeTasks = Object.values(this.#store.getItems());

      return this.#api.syncTasks(storeTasks).then((response) => {
        const createdTasks = getSyncedTasks(response.created);
        const updatedTasks = getSyncedTasks(response.updated);

        const items = createStoreStructure([...createdTasks, ...updatedTasks]);

        this.#store.setItems(items);
      });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }

  static isOnline() {
    return window.navigator.onLine;
  }
}

export default Provider;
