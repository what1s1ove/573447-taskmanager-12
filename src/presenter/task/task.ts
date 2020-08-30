import { replaceWithElement, renderElement, removeElement } from '~/helpers';
import {
  KeyboardKey,
  RenderPosition,
  UserAction,
  UpdateType,
} from '~/common/enums';
import { BindingCb } from '~/common/types';
import Abstract from '~/view/abstract/abstract';
import TaskView from '~/view/task/task';
import TaskEditView from '~/view/task-edit/task-edit';
import { ITask } from '~/common/interfaces';
import { TaskMode, ChangeTaskCb } from './common';

type Constructor = {
  containerComponent: Abstract,
  changeTask: ChangeTaskCb,
  changeMode: BindingCb
};

class Task {
  #taskListComponent: Abstract;

  #changeTask: ChangeTaskCb;

  #changeMode: BindingCb;

  #task: ITask;

  #taskMode: TaskMode;

  #taskComponent: TaskView | null;

  #taskEditComponent: TaskEditView | null;

  constructor({ containerComponent, changeTask, changeMode }: Constructor) {
    this.#taskListComponent = containerComponent;
    this.#changeTask = changeTask;
    this.#changeMode = changeMode;

    this.#taskMode = TaskMode.PREVIEW;

    this.#taskComponent = null;
    this.#taskEditComponent = null;
  }

  #initListeners = () => {
    this.#taskComponent.setOnEditClick(this.#onEditClick);
    this.#taskComponent.setOnFavoriteClick(this.#onFavoriteClick);
    this.#taskComponent.setOnArchiveClick(this.#onArchiveClick);
    this.#taskEditComponent.setOnSubmit(this.#onSubmit);
  };

  #replaceCardToForm = () => {
    replaceWithElement(this.#taskComponent, this.#taskEditComponent);

    document.addEventListener(`keydown`, this.#onEscKeyDown);

    this.#changeMode();
    this.#taskMode = TaskMode.EDIT;
  };

  #replaceFormToCard = () => {
    replaceWithElement(this.#taskEditComponent, this.#taskComponent);

    document.removeEventListener(`keydown`, this.#onEscKeyDown);

    this.#taskMode = TaskMode.PREVIEW;
  };

  #onEscKeyDown = (evt: KeyboardEvent) => {
    if (evt.key === KeyboardKey.ESCAPE) {
      evt.preventDefault();

      this.#replaceFormToCard();
      this.#taskEditComponent.resetTask(this.#task);
    }
  };

  #onEditClick = () => {
    this.#replaceCardToForm();
  };

  #onFavoriteClick = () => {
    this.#changeTask(UserAction.UPDATE_TASK, UpdateType.MINOR, {
      ...this.#task,
      isFavorite: !this.#task.isFavorite,
    });
  };

  #onArchiveClick = () => {
    this.#changeTask(UserAction.UPDATE_TASK, UpdateType.MINOR, {
      ...this.#task,
      isArchive: !this.#task.isArchive,
    });
  };

  #onSubmit = (task: ITask) => {
    this.#changeTask(UserAction.UPDATE_TASK, UpdateType.MINOR, task);
    this.#replaceFormToCard();
  };

  public resetView = () => {
    if (this.#taskMode !== TaskMode.PREVIEW) {
      this.#replaceFormToCard();
    }
  };

  public destroy() {
    removeElement(this.#taskComponent);
    removeElement(this.#taskEditComponent);
  }

  public init(task: ITask) {
    this.#task = task;

    const prevTaskComponent = this.#taskComponent;
    const prevTaskEditComponent = this.#taskEditComponent;

    this.#taskComponent = new TaskView(task);
    this.#taskEditComponent = new TaskEditView(task);

    this.#initListeners();

    if (!prevTaskComponent || !prevTaskEditComponent) {
      renderElement(
        this.#taskListComponent,
        this.#taskComponent,
        RenderPosition.BEFORE_END
      );

      return;
    }

    switch (this.#taskMode) {
      case TaskMode.PREVIEW:
        replaceWithElement(prevTaskComponent, this.#taskComponent);
        break;
      case TaskMode.EDIT:
        replaceWithElement(prevTaskEditComponent, this.#taskEditComponent);
        break;
    }

    removeElement(prevTaskComponent);
    removeElement(prevTaskEditComponent);
  }
}

export default Task;
