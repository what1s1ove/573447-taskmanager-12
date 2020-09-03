import { Api } from '~/services';
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
  FilterType,
} from '~/common/enums';
import TaskPresenter from '~/presenter/task/task';
import NewTaskPresenter from '~/presenter/new-task/new-task';
import TaskModel from '~/model/task/task';
import FilterModel from '~/model/filter/filter';
import NoTaskView from '~/view/no-tasks/no-tasks';
import BoardView from '~/view/board/board';
import SortView from '~/view/sort/sort';
import TaskListView from '~/view/task-list/task-list';
import LoadMoreButtonView from '~/view/load-more-button/load-more-button';
import LoadingView from '~/view/loading/loading';
import { filterToCbMap } from '~/common/maps';
import { BindingCb, INewTask } from '~/common/types';

const TASK_COUNT_PER_STEP = 8;

const sorts = Object.values(SortType);

type Constructor = {
  containerNode: Element,
  tasksModel: TaskModel,
  filterModel: FilterModel
  api: Api
};

class Board {
  #renderedTaskCount: number;

  #tasksModel: TaskModel;

  #filterModel: FilterModel;

  #currentSortType: SortType;

  #taskPresenters: Record<number, TaskPresenter>;

  #newTaskPresenter: NewTaskPresenter;

  #isLoading: boolean;

  #api: Api;

  #boardContainerNode: Element;

  #noTasksComponent: NoTaskView;

  #boardComponent: BoardView;

  #sortComponent: SortView | null;

  #taskListComponent: TaskListView;

  #loadMoreButtonComponent: LoadMoreButtonView | null;

  #loadingComponent: LoadingView;

  constructor({
    containerNode,
    tasksModel,
    filterModel,
    api
  }: Constructor) {
    this.#tasksModel = tasksModel;
    this.#filterModel = filterModel;
    this.#boardContainerNode = containerNode;
    this.#renderedTaskCount = TASK_COUNT_PER_STEP;
    this.#currentSortType = SortType.DEFAULT;
    this.#taskPresenters = {};
    this.#isLoading = true;
    this.#api = api;

    this.#sortComponent = null;
    this.#loadMoreButtonComponent = null;

    this.#noTasksComponent = new NoTaskView();
    this.#boardComponent = new BoardView();
    this.#taskListComponent = new TaskListView();
    this.#loadingComponent = new LoadingView();

    this.#newTaskPresenter = new NewTaskPresenter({
      container: this.#taskListComponent,
      changeTask: this.#changeViewAction,
    });
  }

  get tasks() {
    const { tasks } = this.#tasksModel;
    const filterType = this.#filterModel.filter;
    const filteredTasks = filterToCbMap[filterType](tasks);

    switch (this.#currentSortType) {
      case SortType.DATE_UP:
      case SortType.DATE_DOWN:
        return filteredTasks.sort((a, b) => {
          const rank = getRankByType(a, b, this.#currentSortType);

          return rank;
        });
    }

    return filteredTasks;
  }

  #renderNoTask = () => {
    renderElement(
      this.#boardComponent,
      this.#noTasksComponent,
      RenderPosition.AFTER_BEGIN
    );
  };

  #renderLoading = () => {
    renderElement(
      this.#boardComponent,
      this.#loadingComponent,
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
    if (this.#isLoading) {
      this.#renderLoading();

      return;
    }

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

    this.#newTaskPresenter.destroy();

    Object.values(this.#taskPresenters).forEach((it) => it.destroy());
    this.#taskPresenters = {};

    removeElement(this.#sortComponent);
    removeElement(this.#noTasksComponent);
    removeElement(this.#loadMoreButtonComponent);
    removeElement(this.#loadingComponent);

    this.#renderedTaskCount = isResetRenderedTaskCount
      ? TASK_COUNT_PER_STEP
      : Math.min(taskCount, this.#renderedTaskCount);

    if (isResetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };

  #changeViewAction = (
    actionType: UserAction,
    updateType: UpdateType,
    task: ITask | INewTask
  ) => {
    switch (actionType) {
      case UserAction.UPDATE_TASK:
        this.#api.updateTask(task as ITask).then((it) => {
          this.#tasksModel.updateTask(updateType, it);
        });
        break;
      case UserAction.ADD_TASK:
        this.#api.addTask(task as INewTask).then((it) => {
          this.#tasksModel.addTasks(updateType, it);
        });
        break;
      case UserAction.DELETE_TASK:
        this.#api.deleteTask(task as ITask).then(() => {
          this.#tasksModel.deleteTasks(updateType, task as ITask);
        });
        break;
    }
  };

  #changeModelEvent = (updateType: UpdateType, update: ITask | FilterType) => {
    switch (updateType) {
      case UpdateType.PATCH: {
        const task = update as ITask;

        this.#taskPresenters[task.id].init(task);
        break;
      }
      case UpdateType.MINOR: {
        this.#clearBoard();
        this.#renderBoard();
        break;
      }
      case UpdateType.MAJOR: {
        this.#clearBoard({
          isResetRenderedTaskCount: true,
          isResetSortType: true,
        });
        this.#renderBoard();
        break;
      }
      case UpdateType.INIT: {
        this.#isLoading = false;
        removeElement(this.#loadingComponent);
        this.#renderBoard();
        break;
      }
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
    this.#newTaskPresenter.destroy();

    Object.values(this.#taskPresenters).forEach((it) => it.resetView());
  };

  public createTask(callback: BindingCb) {
    this.#newTaskPresenter.init(callback);
  }

  public destroy() {
    this.#clearBoard({
      isResetRenderedTaskCount: true,
      isResetSortType: true,
    });

    removeElement(this.#taskListComponent);
    removeElement(this.#boardComponent);

    this.#tasksModel.removeObserver(this.#changeModelEvent);
    this.#filterModel.removeObserver(this.#changeModelEvent);
  }

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

    this.#tasksModel.addObserver(this.#changeModelEvent);
    this.#filterModel.addObserver(this.#changeModelEvent);

    this.#renderBoard();
  }
}

export default Board;
