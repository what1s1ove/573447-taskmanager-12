import he from 'he';
import flatpickr from 'flatpickr';
import { Instance } from 'flatpickr/dist/types/instance';
import 'flatpickr/dist/flatpickr.min.css';
import Smart from '~/view/smart/smart';
import { checkIsTaskRepeating } from '~/helpers';
import { ITask, IRawTask } from '~/common/interfaces';
import { TaskColor, TaskRepeatDay } from '~/common/enums';
import { BindingCbWithOne, INewTask } from '~/common/types';
import { createTaskEditDateTemplate } from './templates/task-date/task-date';
import { createTaskEditRepeatingTemplate } from './templates/task-repeating/task-repeating';
import { createTaskEditColorsTemplate } from './templates/task-color/task-color';
import { getRawTask, getClearTask } from './helpers';
import { EMPTY_TASK } from './common';

type Constructor = {
  task: ITask | null
};

type CallBacks = {
  onSubmit: BindingCbWithOne<ITask | INewTask>;
  onDelete: BindingCbWithOne<ITask>;
};

class TaskEdit extends Smart<IRawTask> {
  protected callbacks: CallBacks;

  #datepicker: Instance | null;

  data: IRawTask;

  static parseTaskToData(task: ITask | INewTask) {
    const rawTask = getRawTask(task);

    return rawTask;
  }

  static parseDataToTask(rawTask: ITask | INewTask) {
    const clearTask = getClearTask(rawTask);

    return clearTask;
  }

  constructor({ task }: Constructor) {
    super();
    this.data = TaskEdit.parseTaskToData(task ?? EMPTY_TASK);
    this.#datepicker = null;

    this.initListeners();
  }

  get template() {
    const {
      color,
      description,
      dueDate,
      repeating,
      isDueDate,
      isRepeating,
    } = this.data;

    const dateTemplate = createTaskEditDateTemplate(dueDate, isDueDate);
    const repeatingTemplate = createTaskEditRepeatingTemplate(repeating, isRepeating);
    const colorsTemplate = createTaskEditColorsTemplate(color);

    const repeatingClassName = isRepeating ? `card--repeat` : ``;

    const isFormDisabled = (isDueDate && dueDate === null)
      || (isRepeating && !checkIsTaskRepeating(repeating));

    return `
      <article class="card card--edit card--${color} ${repeatingClassName}">
        <form class="card__form" method="get">
          <div class="card__inner">
            <div class="card__color-bar">
              <svg class="card__color-bar-wave" width="100%" height="10">
                <use xlink:href="#wave"></use>
              </svg>
            </div>
            <div class="card__textarea-wrap">
              <label>
                <textarea class="card__text" placeholder="Start typing your text here..." name="text">${he.encode(description)}</textarea>
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

  #setDatepicker = () => {
    if (this.#datepicker) {
      this.#datepicker.destroy();

      this.#datepicker = null;
    }

    if (this.data.isDueDate) {
      const cardDateNode = this.node.querySelector(`.card__date`);

      this.#datepicker = flatpickr(cardDateNode, {
        dateFormat: `j F`,
        defaultDate: this.data.dueDate,
        onChange: this.#onDueDateChange,
      });
    }
  };

  #onDescInput = ({ target }: Event) => {
    this.updateData({
      description: (target as HTMLInputElement).value,
    }, true);
  };

  #onDueDateToggle = () => {
    const isDueDate = !this.data.isDueDate;

    this.updateData({
      isDueDate,
      isRepeating: isDueDate && false
    });
  };

  #onRepeatingToggle = () => {
    const isRepeating = !this.data.isRepeating;

    this.updateData({
      isRepeating,
      isDueDate: isRepeating && false
    });
  };

  #onDueDateChange = ([userDate]: Date[]) => {
    userDate.setHours(23, 59, 59, 999);

    this.updateData({
      dueDate: userDate
    });
  };

  #onRepeatingChange = ({ target }: Event) => {
    const { value, checked } = target as HTMLInputElement;
    const repeatingDay = value as TaskRepeatDay;

    this.updateData({
      repeating: {
        ...this.data.repeating,
        [repeatingDay]: checked
      }
    });
  };

  #onColorChange = ({ target }: Event) => {
    this.updateData({
      color: (target as HTMLInputElement).value as TaskColor,
    });
  };

  #onSubmit = (evt: Event) => {
    evt.preventDefault();

    this.callbacks.onSubmit(TaskEdit.parseDataToTask(this.data));
  };

  #onDelete = () => {
    this.callbacks.onDelete(TaskEdit.parseDataToTask(this.data) as ITask);
  };

  public removeElement() {
    super.removeElement();

    if (this.#datepicker) {
      this.#datepicker.destroy();
      this.#datepicker = null;
    }
  }

  public resetTask = (task: ITask) => {
    this.updateData(TaskEdit.parseDataToTask(task));
  };

  public setOnSubmit(callback: BindingCbWithOne<ITask | INewTask>) {
    this.callbacks.onSubmit = callback;

    const formNode = this.node.querySelector(`.card__form`);

    formNode.addEventListener(`submit`, this.#onSubmit);
  }

  public setOnDeleteClick(callback: BindingCbWithOne<ITask>) {
    this.callbacks.onDelete = callback;

    const deleteBtnNode = this.node.querySelector(`.card__delete`);

    deleteBtnNode.addEventListener(`click`, this.#onDelete);
  }

  initListeners = () => {
    const descInputNode = this.node.querySelector(`.card__text`);
    const dueDateBtnNode = this.node.querySelector(`.card__date-deadline-toggle`);
    const repeatingBtnNode = this.node.querySelector(`.card__repeat-toggle`);
    const colorWrapNode = this.node.querySelector(`.card__colors-wrap`);

    dueDateBtnNode.addEventListener(`click`, this.#onDueDateToggle);
    repeatingBtnNode.addEventListener(`click`, this.#onRepeatingToggle);
    descInputNode.addEventListener(`input`, this.#onDescInput);
    colorWrapNode.addEventListener(`change`, this.#onColorChange);

    if (this.data.isRepeating) {
      const repeatingDaysInner = this.node.querySelector(`.card__repeat-days-inner`);

      repeatingDaysInner.addEventListener(`change`, this.#onRepeatingChange);
    }

    this.setOnSubmit(this.callbacks.onSubmit);
    this.#setDatepicker();
  };
}

export default TaskEdit;
