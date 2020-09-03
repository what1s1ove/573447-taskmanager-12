import { Observer } from '~/helpers';
import { ITask, IFetchedTask } from '~/common/interfaces';
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
    dueDate: task.due_date,
    repeating: task.repeating,
    color: task.color,
    isFavorite: task.is_favorite,
    isArchive: task.is_archive,
  });

  static adaptToServer = (task: ITask): IFetchedTask => ({
    id: task.id,
    description: task.description,
    due_date: task.dueDate,
    repeating: task.repeating,
    color: task.color,
    is_favorite: task.isFavorite,
    is_archive: task.isArchive,
  });

  set tasks(tasks: ITask[]) {
    this.#tasks = tasks.slice();
  }

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
}

export default Tasks;
