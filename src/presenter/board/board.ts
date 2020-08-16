import { renderElement, replaceWithElement, removeElement } from '~/helpers';
import { ITask } from '~/common/interfaces';
import { RenderPosition, KeyboardKey, SortType } from '~/common/enums';
import NoTaskView from '~/view/no-tasks/no-tasks';
import BoardView from '~/view/board/board';
import SortView from '~/view/sort/sort';
import TaskListView from '~/view/task-list/task-list';
import TaskView from '~/view/task/task';
import TaskEditView from '~/view/task-edit/task-edit';
import LoadMoreButtonView from '~/view/load-more-button/load-more-button';

const START_TASK_RENDER_COUNT = 0;
const TASK_COUNT_PER_STEP = 8;

const sorts = Object.values(SortType);

class Board {
  #boardContainerNode: Element;

  #noTasksComponent: NoTaskView;

  #boardComponent: BoardView;

  #sortComponent: SortView;

  #taskListComponent: TaskListView;

  #boardTasks: ITask[];

  constructor(boardContainerNode: Element) {
    this.#boardContainerNode = boardContainerNode;

    this.#noTasksComponent = new NoTaskView();
    this.#boardComponent = new BoardView();
    this.#sortComponent = new SortView(sorts);
    this.#taskListComponent = new TaskListView();
  }

  #renderNoTask = () => {
    renderElement(this.#boardComponent, this.#noTasksComponent, RenderPosition.AFTER_BEGIN);
  };

  #renderSorts = () => {
    renderElement(
      this.#boardComponent,
      this.#sortComponent,
      RenderPosition.AFTER_BEGIN
    );
  };

  #renderTask = (task: ITask) => {
    const taskComponent = new TaskView(task);
    const taskEditComponent = new TaskEditView(task);

    const replaceCardToForm = () => replaceWithElement(taskComponent, taskEditComponent);

    const replaceFormToCard = () => replaceWithElement(taskEditComponent, taskComponent);

    const onEscKeyDown = (evt: KeyboardEvent) => {
      if (evt.key === KeyboardKey.ESCAPE) {
        evt.preventDefault();

        replaceFormToCard();

        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    taskComponent.setOnEditClick(() => {
      replaceCardToForm();

      document.addEventListener(`keydown`, onEscKeyDown);
    });

    taskEditComponent.setOnSubmit(() => {
      replaceFormToCard();

      document.removeEventListener(`keydown`, onEscKeyDown);
    });

    renderElement(this.#taskListComponent, taskComponent, RenderPosition.BEFORE_END);
  };

  #renderTasks = (from: number, to: number) => {
    this.#boardTasks.slice(from, to).forEach((it) => this.#renderTask(it));
  };

  #renderTaskList = () => {
    const maxTaskPerStepCount = Math.min(
      this.#boardTasks.length,
      TASK_COUNT_PER_STEP
    );

    this.#renderTasks(START_TASK_RENDER_COUNT, maxTaskPerStepCount);

    if (this.#boardTasks.length > TASK_COUNT_PER_STEP) {
      this.#renderLoadMoreButton();
    }
  }

  #renderLoadMoreButton = () => {
    let renderedTaskCount = TASK_COUNT_PER_STEP;

    const loadMoreButtonComponent = new LoadMoreButtonView();

    renderElement(this.#boardComponent, loadMoreButtonComponent, RenderPosition.BEFORE_END);

    loadMoreButtonComponent.setOnClick(() => {
      this.#boardTasks
        .slice(renderedTaskCount, renderedTaskCount + TASK_COUNT_PER_STEP)
        .forEach((boardTask) => this.#renderTask(boardTask));

      renderedTaskCount += TASK_COUNT_PER_STEP;

      if (renderedTaskCount >= this.#boardTasks.length) {
        removeElement(loadMoreButtonComponent);
      }
    });
  };

  #renderBoard = () => {
    const isNoTaskComponentRender = this.#boardTasks.every(
      (task) => task.isArchive
    );

    if (isNoTaskComponentRender) {
      this.#renderNoTask();

      return;
    }

    this.#renderSorts();
    this.#renderTaskList();
  };

  public init(tasks: ITask[]) {
    this.#boardTasks = tasks.slice();

    renderElement(
      this.#boardContainerNode,
      this.#boardComponent,
      RenderPosition.BEFORE_END
    );
    renderElement(
      this.#boardComponent,
      this.#taskListComponent,
      RenderPosition.BEFORE_END
    );

    this.#renderBoard();
  }
}

export default Board;
