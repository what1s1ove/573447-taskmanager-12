import { replaceWithElement, renderElement, removeElement } from '~/helpers';
import { KeyboardKey, RenderPosition } from '~/common/enums';
import Abstract from '~/view/abstract/abstract';
import TaskView from '~/view/task/task';
import TaskEditView from '~/view/task-edit/task-edit';
import { ITask } from '~/common/interfaces';
import { TaskMode, ChangeTaskCb } from './common';

class Task {
  #taskListComponent: Abstract;

  #changeTask: ChangeTaskCb;

  #task: ITask;

  #taskMode: TaskMode;

  #taskComponent: TaskView | null;

  #taskEditComponent: TaskEditView | null;

  constructor(taskListNode: Abstract, changeTask: ChangeTaskCb) {
    this.#taskListComponent = taskListNode;
    this.#changeTask = changeTask;

    this.#taskMode = TaskMode.PREVIEW;

    this.#taskComponent = null;
    this.#taskEditComponent = null;
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

    if (this.#taskListComponent.node.contains(prevTaskComponent.node)) {
      replaceWithElement(prevTaskComponent, this.#taskComponent,);
    }

    if (this.#taskListComponent.node.contains(prevTaskEditComponent.node)) {
      replaceWithElement(prevTaskEditComponent, this.#taskEditComponent);
    }

    // switch (this.#taskMode) {
    //   case TaskMode.PREVIEW:
    //     replaceWithElement(prevTaskComponent, this.#taskComponent);
    //     break;
    //   case TaskMode.EDIT:
    //     replaceWithElement(prevTaskEditComponent, this.#taskEditComponent);
    //     break;
    // }

    removeElement(prevTaskComponent);
    removeElement(prevTaskEditComponent);
  }

  public destroy() {
    removeElement(this.#taskComponent);
    removeElement(this.#taskEditComponent);
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
  };

  #replaceFormToCard = () => {
    replaceWithElement(this.#taskEditComponent, this.#taskComponent);

    document.removeEventListener(`keydown`, this.#onEscKeyDown);
  };

  #onEscKeyDown = (evt: KeyboardEvent) => {
    if (evt.key === KeyboardKey.ESCAPE) {
      evt.preventDefault();

      this.#replaceFormToCard();
      this.#taskEditComponent.resetTask(this.#task);

      document.removeEventListener(`keydown`, this.#onEscKeyDown);
    }
  };

  #onEditClick = () => {
    this.#replaceCardToForm();
  };

  #onFavoriteClick = () => {
    this.#changeTask({
      ...this.#task,
      isFavorite: !this.#task.isFavorite,
    });
  };

  #onArchiveClick = () => {
    this.#changeTask({
      ...this.#task,
      isArchive: !this.#task.isArchive,
    });
  };

  #onSubmit = (task: ITask) => {
    this.#changeTask(task);
    this.#replaceFormToCard();
  };
}

export default Task;
