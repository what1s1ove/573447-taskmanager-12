import AbstractView from '~/view/abstract/abstract';
import {
  formatTaskDueDate,
  checkIsTaskExpired,
  checkIsTaskRepeating,
} from '~/helpers';
import { ITask } from '~/common/interfaces';
import { BindingCb } from '~/common/types';

type CallBacks = {
  onEditClick: BindingCb;
  onFavoriteClick: BindingCb;
  onArchiveClick: BindingCb;
};

class Task extends AbstractView {
  protected callbacks: CallBacks;

  #task: ITask;

  constructor(task: ITask) {
    super();
    this.#task = task;
  }

  get template() {
    const {
      color,
      description,
      dueDate,
      repeating,
      isArchive,
      isFavorite,
    } = this.#task;

    const date = formatTaskDueDate(dueDate);

    const deadlineClassName = checkIsTaskExpired(dueDate)
      ? `card--deadline`
      : ``;
    const repeatClassName = checkIsTaskRepeating(repeating)
      ? `card--repeat`
      : ``;
    const archiveClassName = isArchive
      ? `card__btn--archive card__btn--disabled`
      : `card__btn--archive`;

    const favoriteClassName = isFavorite
      ? `card__btn--favorites card__btn--disabled`
      : `card__btn--favorites`;

    return `
      <article class="card card--${color} ${deadlineClassName} ${repeatClassName}">
        <div class="card__form">
          <div class="card__inner">
            <div class="card__control">
              <button type="button" class="card__btn card__btn--edit">
                edit
              </button>
              <button type="button" class="card__btn ${archiveClassName}">
                archive
              </button>
              <button
                type="button"
                class="card__btn ${favoriteClassName}"
              >
                favorites
              </button>
            </div>
            <div class="card__color-bar">
              <svg class="card__color-bar-wave" width="100%" height="10">
                <use xlink:href="#wave"></use>
              </svg>
            </div>
            <div class="card__textarea-wrap">
              <p class="card__text">${description}</p>
            </div>
            <div class="card__settings">
              <div class="card__details">
                <div class="card__dates">
                  <div class="card__date-deadline">
                    <p class="card__input-deadline-wrap">
                      <span class="card__date">${date}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    `;
  }

  #onEditClick = () => {
    this.callbacks.onEditClick();
  };

  #onFavoriteClick = () => {
    this.callbacks.onFavoriteClick();
  };

  #onArchiveClick = () => {
    this.callbacks.onArchiveClick();
  };

  public setOnEditClick(callback: BindingCb) {
    this.callbacks.onEditClick = callback;

    const editBtnNode = this.node.querySelector(`.card__btn--edit`);

    editBtnNode.addEventListener(`click`, this.#onEditClick);
  }

  public setOnFavoriteClick(callback: BindingCb) {
    this.callbacks.onFavoriteClick = callback;

    const favoriteBtnNode = this.node.querySelector(`.card__btn--favorites`);

    favoriteBtnNode.addEventListener(`click`, this.#onFavoriteClick);
  }

  public setOnArchiveClick(callback: BindingCb) {
    this.callbacks.onArchiveClick = callback;

    const archiveBtnNode = this.node.querySelector(`.card__btn--archive`);

    archiveBtnNode.addEventListener(`click`, this.#onArchiveClick);
  }
}

export default Task;
