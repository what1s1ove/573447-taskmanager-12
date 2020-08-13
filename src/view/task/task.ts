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
    this.#templateMode = task ? TaskTemplateMode.PREVIEW : TaskTemplateMode.EDIT;
    this.#element = null;
  }

  get node() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    switch (this.#templateMode) {
      case TaskTemplateMode.PREVIEW:
        return createTaskTemplate(this.#task);
      case TaskTemplateMode.EDIT:
        return createTaskEditTemplate(this.#task);
    }

    return null;
  }

  public removeElement = () => {
    this.#element = null;
  };
}

export default Task;
