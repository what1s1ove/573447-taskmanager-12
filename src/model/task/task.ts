import { Observer } from '~/helpers';
import { ITask } from '~/common/interfaces';

class Tasks extends Observer {
  #tasks: ITask[];

  constructor() {
    super();
    this.#tasks = [];
  }

  set tasks(tasks: ITask[]) {
    this.#tasks = tasks.slice();
  }

  get tasks() {
    return this.#tasks;
  }
}

export default Tasks;
