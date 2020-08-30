import { renderElement, removeElement, getRandomId } from '~/helpers';
import { ITask } from '~/common/interfaces';
import {
  RenderPosition,
  KeyboardKey,
  UserAction,
  UpdateType,
} from '~/common/enums';
import { ChangeTaskCb } from '~/common/types';
import Abstract from '~/view/abstract/abstract';
import TaskEditView from '~/view/task-edit/task-edit';

type Constructor = {
  container: Abstract;
  changeTask: ChangeTaskCb;
};

class NewTask {
  #taskListContainer: Abstract;

  #changeTask: ChangeTaskCb;

  #taskEditComponent: TaskEditView | null;

  constructor({ container, changeTask }: Constructor) {
    this.#taskListContainer = container;
    this.#changeTask = changeTask;

    this.#taskEditComponent = null;
  }

  #submitForm = (task: ITask) => {
    this.#changeTask(UserAction.ADD_TASK, UpdateType.MINOR, {
      ...task,
      id: getRandomId(),
    });

    this.destroy();
  };

  #deleteTask = () => {
    this.destroy();
  };

  #onEscKeyDown = (evt: KeyboardEvent) => {
    if (evt.key === KeyboardKey.ESCAPE) {
      evt.preventDefault();

      this.destroy();
    }
  };

  public destroy() {
    if (!this.#taskEditComponent) {
      return;
    }

    removeElement(this.#taskEditComponent);
    this.#taskEditComponent = null;

    document.removeEventListener(`keydown`, this.#onEscKeyDown);
  }

  public init() {
    if (this.#taskEditComponent) {
      return;
    }

    this.#taskEditComponent = new TaskEditView({
      task: null,
    });
    this.#taskEditComponent.setOnSubmit(this.#submitForm);
    this.#taskEditComponent.setOnDeleteClick(this.#deleteTask);

    renderElement(
      this.#taskListContainer,
      this.#taskEditComponent,
      RenderPosition.AFTER_BEGIN
    );

    document.addEventListener(`keydown`, this.#onEscKeyDown);
  }
}

export default NewTask;
