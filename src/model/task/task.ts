import { Observer } from '~/helpers';
import { ITask } from '~/common/interfaces';

class Tasks extends Observer {
  #tasks: ITask[];

  constructor() {
    super();
    this.#tasks = [];
  }

  setTasks(tasks: ITask[]) {
    this.#tasks = tasks.slice();
  }

  getTasks() {
    return this.#tasks;
  }
}

export default Tasks;
