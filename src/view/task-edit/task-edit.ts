import AbstractView from '~/view/abstract/abstract';
import { checkIsTaskExpired, replaceWithElement } from '~/helpers';
import { ITask } from '~/common/interfaces';
import { BindingCb, BindingCbWithOne } from '~/common/types';
import { TASK_DEFAULT_REPEATING } from '~/common/constants';
import { createTaskEditDateTemplate } from './templates/task-date/task-date';
import { createTaskEditRepeatingTemplate } from './templates/task-repeating/task-repeating';
import { createTaskEditColorsTemplate } from './templates/task-color/task-color';
import { EMPTY_TASK } from '../task-list/common';

type CallBacks = {
  onSubmit: BindingCbWithOne<ITask>;
};

class TaskEdit extends AbstractView {
  protected callbacks: CallBacks;

  #task: ITask | null;

  static parseTask(task: ITask) {
    const copiedTask = { ...task };

    if (copiedTask.isDueDate) {
      copiedTask.dueDate = null;
    }

    if (copiedTask.isRepeating) {
      copiedTask.repeating = TASK_DEFAULT_REPEATING;
    }

    delete copiedTask.isDueDate;
    delete copiedTask.isRepeating;

    return copiedTask;
  }

  constructor(task: ITask | null) {
    super();
    this.#task = TaskEdit.parseTask(task ?? EMPTY_TASK);

    this.#initListeners();
  }

  get template() {
    const {
      color,
      description,
      dueDate,
      repeating,
      isDueDate,
      isRepeating
    } = this.#task;

    const dateTemplate = createTaskEditDateTemplate(dueDate, isDueDate);
    const repeatingTemplate = createTaskEditRepeatingTemplate(repeating, isRepeating);
    const colorsTemplate = createTaskEditColorsTemplate(color);

    const deadlineClassName = checkIsTaskExpired(dueDate)
      ? `card--deadline`
      : ``;
    const repeatingClassName = isRepeating ? `card--repeat` : ``;

    return `
      <article class="card card--edit card--${color} ${deadlineClassName} ${repeatingClassName}">
        <form class="card__form" method="get">
          <div class="card__inner">
            <div class="card__color-bar">
              <svg class="card__color-bar-wave" width="100%" height="10">
                <use xlink:href="#wave"></use>
              </svg>
            </div>
            <div class="card__textarea-wrap">
              <label>
                <textarea class="card__text" placeholder="Start typing your text here..." name="text">${description}</textarea>
              </label>
            </div>
            <div class="card__settings">
              <div class="card__details">
                <div class="card__dates">
                  ${dateTemplate}
                  ${repeatingTemplate}
                </div>
              </div>
              <div class="card__colors-inner">
                <h3 class="card__colors-title">Color</h3>
                <div class="card__colors-wrap">
                  ${colorsTemplate}
                </div>
              </div>
            </div>
            <div class="card__status-btns">
              <button class="card__save" type="submit">save</button>
              <button class="card__delete" type="button">delete</button>
            </div>
          </div>
        </form>
      </article>
    `;
  }

  #initListeners = () => {
    const dueDateBtnNode = this.node.querySelector(`.card__date-deadline-toggle`);
    const repeatingBtnNode = this.node.querySelector(`.card__repeat-toggle`);

    dueDateBtnNode.addEventListener(`click`, this.#onDueDateToggle);
    repeatingBtnNode.addEventListener(`click`, this.#onRepeatingToggle);
    this.setOnSubmit(this.callbacks.onSubmit);
  };


  #updateDate = (taskPayload: Partial<ITask>) => {
    this.#task = {
      ...this.#task,
      ...taskPayload,
    };

    this.#updateNode();
  }

  #updateNode = () => {
    let prevElement = this.node;
    this.removeElement();

    const newElement = this.node;

    replaceWithElement(prevElement, newElement);
    prevElement = null;

    this.#initListeners();
  }

  #onDueDateToggle = () => {
    this.#updateDate({
      isDueDate: !this.#task.isDueDate,
    });
  };

  #onRepeatingToggle = () => {
    this.#updateDate({
      isRepeating: !this.#task.isRepeating,
    });
  };

  #onSubmit = (evt: Event) => {
    evt.preventDefault();

    this.callbacks.onSubmit(TaskEdit.parseTask(this.#task));
  };

  public setOnSubmit(callback: BindingCbWithOne<ITask>) {
    this.callbacks.onSubmit = callback;

    const formNode = this.node.querySelector(`.card__form`);

    formNode.addEventListener(`submit`, this.#onSubmit);
  }
}

export default TaskEdit;
