import { replaceWithElement, renderElement, removeElement } from '~/helpers';
import { KeyboardKey, RenderPosition } from '~/common/enums';
import Abstract from '~/view/abstract/abstract';
import TaskView from '~/view/task/task';
import TaskEditView from '~/view/task-edit/task-edit';
import { ITask } from '~/common/interfaces';
import { TaskMode } from './common';

class Task {
  #task: ITask;

  #taskMode: TaskMode;

  #taskListNode: Element | Abstract;

  #taskComponent: TaskView | null;

  #taskEditComponent: TaskEditView | null;

  constructor(taskListNode: Element | Abstract) {
    this.#taskListNode = taskListNode;

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
        this.#taskListNode,
        this.#taskComponent,
        RenderPosition.BEFORE_END
      );

      return;
    }

    switch (this.#taskMode) {
      case TaskMode.PREVIEW:
        replaceWithElement(this.#taskComponent, prevTaskComponent);
        break;
      case TaskMode.EDIT:
        replaceWithElement(this.#taskEditComponent, prevTaskEditComponent);
        break;
    }

    removeElement(prevTaskComponent);
    removeElement(prevTaskEditComponent);
  }

  public destroy() {
    removeElement(this.#taskComponent);
    removeElement(this.#taskEditComponent);
  }

  #initListeners = () => {
    this.#taskComponent.setOnEditClick(this.#onEditClick);
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

      document.removeEventListener(`keydown`, this.#onEscKeyDown);
    }
  };

  #onEditClick = () => {
    this.#replaceCardToForm();
  };

  #onSubmit = () => {
    this.#replaceFormToCard();
  };
}

export default Task;
