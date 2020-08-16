import AbstractView from '~/view/abstract/abstract';
import { checkIsTaskExpired, checkIsTaskRepeating } from '~/helpers';
import { createTaskEditDateTemplate } from './templates/task-date/task-date';
import { createTaskEditRepeatingTemplate } from './templates/task-repeating/task-repeating';
import { createTaskEditColorsTemplate } from './templates/task-color/task-color';
import { ITask } from '~/common/interfaces';
import { BindingCb } from '~/common/types';
import { EMPTY_TASK } from '../task-list/common';

type CallBacks = {
  onSubmit: BindingCb;
}

class EditTask extends AbstractView {
  protected callbacks: CallBacks;

  #task: ITask | null;

  constructor(task: ITask | null) {
    super();
    this.#task = task ?? EMPTY_TASK;
  }

  get template() {
    const {
      color,
      description,
      dueDate,
      repeating
    } = this.#task;

    const dateTemplate = createTaskEditDateTemplate(dueDate);
    const repeatingTemplate = createTaskEditRepeatingTemplate(repeating);
    const colorsTemplate = createTaskEditColorsTemplate(color);

    const deadlineClassName = checkIsTaskExpired(dueDate)
      ? `card--deadline`
      : ``;
    const repeatingClassName = checkIsTaskRepeating(repeating)
      ? `card--repeat`
      : ``;

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

  #onSubmit = (evt: Event) => {
    evt.preventDefault();

    this.callbacks.onSubmit();
  }

  setOnSubmit(callback: BindingCb) {
    this.callbacks.onSubmit = callback;

    const formNode = this.node.querySelector(`.card__form`);

    formNode.addEventListener(`submit`, this.#onSubmit);
  }
}

export default EditTask;
