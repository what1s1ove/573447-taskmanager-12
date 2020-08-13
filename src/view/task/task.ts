import { createElement } from '~/helpers';
import { ITask } from '~/common/interfaces';
import { createTaskTemplate } from './templates/task-template/task-template';
import { EMPTY_TASK, TaskTemplateMode } from './common';
import { createTaskEditTemplate } from './templates/task-edit-template/task-edit-template';

class Task {
  #element: Element | null;

  #task: ITask;

  #templateMode: TaskTemplateMode;

  constructor(task: ITask | null) {
    this.#task = task ?? EMPTY_TASK;
    this.#templateMode = task ? TaskTemplateMode.DEFAULT : TaskTemplateMode.EDIT;
    this.#element = null;
  }

  get node() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    // eslint-disable-next-line default-case
    switch (this.#templateMode) {
      case TaskTemplateMode.DEFAULT:
        return createTaskTemplate(this.#task);
      case TaskTemplateMode.EDIT:
        return createTaskEditTemplate(this.#task);
    }

    return null;
  }

  removeElement() {
    this.#element = null;
  }
}

export default Task;
