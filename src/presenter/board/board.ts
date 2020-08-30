import {
  renderElement,
  removeElement,
  getRankByType,
} from '~/helpers';
import { ITask } from '~/common/interfaces';
import {
  RenderPosition,
  SortType,
  UserAction,
  UpdateType,
} from '~/common/enums';
import TaskPresenter from '~/presenter/task/task';
import TaskModel from '~/model/task/task';
import NoTaskView from '~/view/no-tasks/no-tasks';
import BoardView from '~/view/board/board';
import SortView from '~/view/sort/sort';
import TaskListView from '~/view/task-list/task-list';
import LoadMoreButtonView from '~/view/load-more-button/load-more-button';

const TASK_COUNT_PER_STEP = 8;

const sorts = Object.values(SortType);

type Constructor = {
  containerNode: Element,
  tasksModel: TaskModel
};

class Board {
  #renderedTaskCount: number;

  #tasksModel: TaskModel;

  #currentSortType: SortType;

  #taskPresenters: Record<number, TaskPresenter>;

  #boardContainerNode: Element;

  #noTasksComponent: NoTaskView;

  #boardComponent: BoardView;

  #sortComponent: SortView | null;

  #taskListComponent: TaskListView;

  #loadMoreButtonComponent: LoadMoreButtonView | null;

  constructor({ containerNode, tasksModel }: Constructor) {
    this.#tasksModel = tasksModel;
    this.#boardContainerNode = containerNode;
    this.#renderedTaskCount = TASK_COUNT_PER_STEP;
    this.#currentSortType = SortType.DEFAULT;
    this.#taskPresenters = {};

    this.#sortComponent = null;
    this.#loadMoreButtonComponent = null;

    this.#noTasksComponent = new NoTaskView();
    this.#boardComponent = new BoardView();
    this.#taskListComponent = new TaskListView();

    this.#tasksModel.addObserver(this.#changeModelEvent);
  }

  get tasks() {
    switch (this.#currentSortType) {
      case SortType.DATE_UP:
      case SortType.DATE_DOWN:
        this.#tasksModel.tasks.sort((a, b) => {
          const rank = getRankByType(a, b, this.#currentSortType);

          return rank;
        });
        break;
    }

    return this.#tasksModel.tasks;
  }

  #renderNoTask = () => {
    renderElement(
      this.#boardComponent,
      this.#noTasksComponent,
      RenderPosition.AFTER_BEGIN
    );
  };

  #renderSorts = () => {
    if (!this.#sortComponent) {
      this.#sortComponent = null;
    }

    this.#sortComponent = new SortView({
      currentSort: this.#currentSortType,
      sorts,
    });
    this.#sortComponent.setOnSortTypeChange(this.#changeSortType);

    renderElement(
      this.#boardComponent,
      this.#sortComponent,
      RenderPosition.AFTER_BEGIN
    );
  };

  #renderTask = (task: ITask) => {
    const taskPresenter = new TaskPresenter({
      containerComponent: this.#taskListComponent,
      changeTask: this.#changeViewAction,
      changeMode: this.#changeTaskMode,
    });

    taskPresenter.init(task);

    this.#taskPresenters[task.id] = taskPresenter;
  };

  #changeViewAction = (
    actionType: UserAction,
    updateType: UpdateType,
    task: ITask
  ) => {
    switch (actionType) {
      case UserAction.UPDATE_TASK:
        this.#tasksModel.updateTask(updateType, task);
        break;
      case UserAction.ADD_TASK:
        this.#tasksModel.addTasks(updateType, task);
        break;
      case UserAction.DELETE_TASK:
        this.#tasksModel.deleteTasks(updateType, task);
        break;
    }
  };

  #changeModelEvent = (updateType: UpdateType, task: ITask) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#taskPresenters[task.id].init(task);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({
          isResetRenderedTaskCount: true,
          isResetSortType: true,
        });
        this.#renderBoard();
        break;
    }
  };

  #renderTasks = (tasks: ITask[]) => {
    tasks.forEach((it) => this.#renderTask(it));
  };

  #renderLoadMoreButton = () => {
    if (this.#loadMoreButtonComponent !== null) {
      this.#loadMoreButtonComponent = null;
    }

    this.#loadMoreButtonComponent = new LoadMoreButtonView();
    this.#loadMoreButtonComponent.setOnClick(this.#loadMoreTasks);

    renderElement(
      this.#boardComponent,
      this.#loadMoreButtonComponent,
      RenderPosition.BEFORE_END
    );
  };

  #renderBoard = () => {
    const taskCount = this.tasks.length;

    if (!taskCount) {
      this.#renderNoTask();

      return;
    }

    this.#renderSorts();
    this.#renderTasks(
      this.tasks.slice(0, Math.min(taskCount, this.#renderedTaskCount))
    );

    if (taskCount > this.#renderedTaskCount) {
      this.#renderLoadMoreButton();
    }
  };

  #clearBoard = ({
    isResetRenderedTaskCount = false,
    isResetSortType = false,
  } = {}) => {
    const taskCount = this.tasks.length;

    Object.values(this.#taskPresenters).forEach((it) => it.destroy());
    this.#taskPresenters = {};

    removeElement(this.#sortComponent);
    removeElement(this.#noTasksComponent);
    removeElement(this.#loadMoreButtonComponent);

    this.#renderedTaskCount = isResetRenderedTaskCount
      ? TASK_COUNT_PER_STEP
      : Math.min(taskCount, this.#renderedTaskCount);

    if (isResetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };

  #loadMoreTasks = () => {
    const taskCount = this.tasks.length;
    const newRenderedTaskCount = Math.min(
      taskCount,
      this.#renderedTaskCount + TASK_COUNT_PER_STEP
    );
    const tasks = this.tasks.slice(
      this.#renderedTaskCount,
      newRenderedTaskCount
    );

    this.#renderTasks(tasks);
    this.#renderedTaskCount = newRenderedTaskCount;

    if (this.#renderedTaskCount >= taskCount) {
      removeElement(this.#loadMoreButtonComponent);
    }
  };

  #changeSortType = (sortType: SortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard({ isResetRenderedTaskCount: true });
    this.#renderBoard();
  };

  #changeTaskMode = () => {
    Object.values(this.#taskPresenters).forEach((it) => it.resetView());
  };

  public init() {
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
