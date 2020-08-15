import { createElement } from '~/helpers';
import { ITask } from '~/common/interfaces';
import { BindingCB } from '~/common/types';
import { createTaskTemplate } from './templates/task-template/task-template';
import { EMPTY_TASK, TaskTemplateMode } from './common';
import { createTaskEditTemplate } from './templates/task-edit-template/task-edit-template';

class Task {
  #_element: Element | null;

  #task: ITask;

  #templateMode: TaskTemplateMode;

  #cleanUpListeners: BindingCB | null;

  constructor(task: ITask | null) {
    this.#task = task ?? EMPTY_TASK;
    this.#templateMode = task
      ? TaskTemplateMode.PREVIEW
      : TaskTemplateMode.EDIT;
    this.#cleanUpListeners = null;
    this.#_element = null;
  }

  get node() {
    this.element = createElement(this.template);

    return this.#_element;
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

  set element(node: Element | null) {
    if (this.#_element) {
      this.#_element.replaceWith(node);
    }

    this.#_element = node;

    this.#initListeners();
  }

  #initListeners = () => {
    switch (this.#templateMode) {
      case TaskTemplateMode.PREVIEW: {
        const btnEditNode = this.#_element.querySelector(`.card__btn--edit`);

        const onEditClick = () => {
          this.#toggleMode(TaskTemplateMode.EDIT);
        };

        btnEditNode.addEventListener(`click`, onEditClick);

        this.#cleanUpListeners = () => {
          btnEditNode.removeEventListener(`click`, onEditClick);
        };

        break;
      }
      case TaskTemplateMode.EDIT: {
        const formEdit = this.#_element.querySelector(`.card__form`);

        const onSubmit = (evt: Event) => {
          evt.preventDefault();

          this.#toggleMode(TaskTemplateMode.PREVIEW);
        };

        formEdit.addEventListener(`submit`, onSubmit);

        this.#cleanUpListeners = () => {
          formEdit.removeEventListener(`submit`, onSubmit);
        };

        break;
      }
    }
  };

  #toggleMode = (mode: TaskTemplateMode) => {
    this.#templateMode = mode;

    this.#cleanUpListeners();

    this.element = createElement(this.template);
  };

  public removeElement = () => {
    this.element = null;
  };
}

export default Task;
