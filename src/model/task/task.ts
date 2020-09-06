import { Observer } from '~/helpers';
import { ITask, IFetchedTask } from '~/common/interfaces';
import { INewTask } from '~/common/types';
import { UpdateType } from '~/common/enums';

class Tasks extends Observer<ITask> {
  #tasks: ITask[];

  constructor() {
    super();
    this.#tasks = [];
  }

  static adaptToClient = (task: IFetchedTask): ITask => ({
    id: task.id,
    description: task.description,
    dueDate: new Date(task.due_date),
    repeating: task.repeating_days,
    color: task.color,
    isFavorite: task.is_favorite,
    isArchive: task.is_archived,
  });

  static adaptToServer = (task: ITask): IFetchedTask => ({
    id: task.id,
    description: task.description,
    due_date: task.dueDate.toISOString(),
    repeating_days: task.repeating,
    color: task.color,
    is_favorite: task.isFavorite,
    is_archived: task.isArchive,
  });

  static adaptToSaveToServer = (task: INewTask): Partial<IFetchedTask> => ({
    description: task.description,
    due_date: task.dueDate.toISOString(),
    repeating_days: task.repeating,
    color: task.color,
    is_favorite: task.isFavorite,
    is_archived: task.isArchive,
  });

  get tasks() {
    return this.#tasks;
  }

  public updateTask = (type: UpdateType, task: ITask) => {
    this.#tasks = this.#tasks.map((it) => (it.id === task.id ? task : it));

    this.notify(type, task);
  };

  public addTasks = (type: UpdateType, task: ITask) => {
    this.#tasks = [task, ...this.#tasks];

    this.notify(type, task);
  };

  public deleteTasks = (type: UpdateType, task: ITask) => {
    this.#tasks = this.#tasks.filter((it) => it.id !== task.id);

    this.notify(type, task);
  };

  public setTasks(type: UpdateType, tasks: ITask[]) {
    this.#tasks = tasks.slice();

    this.notify(type);
  }
}

export default Tasks;
