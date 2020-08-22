import AbstractView from '~/view/abstract/abstract';
import { checkIsTaskExpired, replaceWithElement, checkIsTaskRepeating } from '~/helpers';
import { ITask } from '~/common/interfaces';
import { BindingCbWithOne } from '~/common/types';
import { TASK_DEFAULT_REPEATING } from '~/common/constants';
import { createTaskEditDateTemplate } from './templates/task-date/task-date';
import { createTaskEditRepeatingTemplate } from './templates/task-repeating/task-repeating';
import { createTaskEditColorsTemplate } from './templates/task-color/task-color';
import { EMPTY_TASK } from '../task-list/common';
import { TaskColor, TaskRepeatDay } from '~/common/enums';

type CallBacks = {
  onSubmit: BindingCbWithOne<ITask>;
};

class TaskEdit extends AbstractView {
  protected callbacks: CallBacks;

  #data: ITask | null;

  static parseTaskToData(task: ITask) {
    const parsedData = {
      ...task,
      isDueDate: task.dueDate !== null,
      isRepeating: checkIsTaskRepeating(task.repeating)
    };

    return parsedData;
  }

  static parseDataToTask(data: ITask) {
    const parsedTask = { ...data };

    if (!parsedTask.isDueDate) {
      parsedTask.dueDate = null;
    }

    if (!parsedTask.isRepeating) {
      parsedTask.repeating = TASK_DEFAULT_REPEATING;
    }

    delete parsedTask.isDueDate;
    delete parsedTask.isRepeating;

    return parsedTask;
  }

  constructor(task: ITask | null) {
    super();
    this.#data = TaskEdit.parseTaskToData(task ?? EMPTY_TASK);

    this.#initListeners();
  }

  get template() {
    const {
      color,
      description,
      dueDate,
      repeating,
      isDueDate,
      isRepeating,
    } = this.#data;

    const dateTemplate = createTaskEditDateTemplate(dueDate, isDueDate);
    const repeatingTemplate = createTaskEditRepeatingTemplate(repeating,isRepeating);
    const colorsTemplate = createTaskEditColorsTemplate(color);

    const deadlineClassName = checkIsTaskExpired(dueDate) ? `card--deadline` : ``;
    const repeatingClassName = isRepeating ? `card--repeat` : ``;

    const isFormDisabled = isRepeating && !checkIsTaskRepeating(repeating);

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
              <button
                ${isFormDisabled ? `disabled` : ``}
                class="card__save"
                type="submit"
                >
                  save
              </button>
              <button class="card__delete" type="button">delete</button>
            </div>
          </div>
        </form>
      </article>
    `;
  }

  #initListeners = () => {
    const descInputNode = this.node.querySelector(`.card__text`);
    const dueDateBtnNode = this.node.querySelector(`.card__date-deadline-toggle`);
    const repeatingBtnNode = this.node.querySelector(`.card__repeat-toggle`);
    const colorWrapNode = this.node.querySelector(`.card__colors-wrap`);

    dueDateBtnNode.addEventListener(`click`, this.#onDueDateToggle);
    repeatingBtnNode.addEventListener(`click`, this.#onRepeatingToggle);
    descInputNode.addEventListener(`input`, this.#onDescInput);
    colorWrapNode.addEventListener(`change`, this.#onColorChange);

    if (this.#data.isRepeating) {
      const repeatingDaysInner = this.node.querySelector(`.card__repeat-days-inner`);

      repeatingDaysInner.addEventListener(`change`, this.#onRepeatingChange);
    }

    this.setOnSubmit(this.callbacks.onSubmit);
  };

  #updateData = (dataPayload: Partial<ITask>, isDataUpdating = false) => {
    this.#data = {
      ...this.#data,
      ...dataPayload,
    };

    if (isDataUpdating) {
      return;
    }

    this.#updateNode();
  };

  #updateNode = () => {
    let prevElement = this.node;
    this.removeElement();

    const newElement = this.node;

    replaceWithElement(prevElement, newElement);
    prevElement = null;

    this.#initListeners();
  };

  #onDescInput = ({ target }: Event) => {
    this.#updateData({
        description: (target as HTMLInputElement).value,
      }, true);
  };

  #onDueDateToggle = () => {
    const isDueDate = !this.#data.isDueDate;

    this.#updateData({
      isDueDate,
      isRepeating: isDueDate && false
    });
  };

  #onRepeatingToggle = () => {
    const isRepeating = !this.#data.isRepeating;

    this.#updateData({
      isRepeating,
      isDueDate: isRepeating && false
    });
  };

  #onRepeatingChange = ({ target }: Event) => {
    const { value, checked } = target as HTMLInputElement;
    const repeatingDay = value as TaskRepeatDay;

    this.#updateData({
      repeating: {
        ...this.#data.repeating,
        [repeatingDay]: checked
      }
    })
  }

  #onColorChange = ({ target }: Event) => {
    this.#updateData({
      color: (target as HTMLInputElement).value as TaskColor,
    });
  }

  #onSubmit = (evt: Event) => {
    evt.preventDefault();

    this.callbacks.onSubmit(TaskEdit.parseDataToTask(this.#data));
  };

  public setOnSubmit(callback: BindingCbWithOne<ITask>) {
    this.callbacks.onSubmit = callback;

    const formNode = this.node.querySelector(`.card__form`);

    formNode.addEventListener(`submit`, this.#onSubmit);
  }
}

export default TaskEdit;
