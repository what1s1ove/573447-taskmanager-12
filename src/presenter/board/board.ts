import {
  renderElement,
  removeElement,
  getRankByType,
  updateItem,
} from '~/helpers';
import { ITask } from '~/common/interfaces';
import { RenderPosition, SortType } from '~/common/enums';
import TaskPresenter from '~/presenter/task/task';
import TaskModel from '~/model/task/task';
import NoTaskView from '~/view/no-tasks/no-tasks';
import BoardView from '~/view/board/board';
import SortView from '~/view/sort/sort';
import TaskListView from '~/view/task-list/task-list';
import LoadMoreButtonView from '~/view/load-more-button/load-more-button';

const START_TASK_RENDER_COUNT = 0;
const TASK_COUNT_PER_STEP = 8;

const sorts = Object.values(SortType);

type Constructor = {
  containerNode: Element,
  tasksModel: TaskModel
};

class Board {
  #boardTasks: ITask[];

  #initialTasks: ITask[];

  #renderedTaskCount: number;

  #tasksModel: TaskModel;

  #currentSortType: SortType;

  #taskPresenters: Record<number, TaskPresenter>;

  #boardContainerNode: Element;

  #noTasksComponent: NoTaskView;

  #boardComponent: BoardView;

  #sortComponent: SortView;

  #taskListComponent: TaskListView;

  #loadMoreButtonComponent: LoadMoreButtonView;

  constructor({ containerNode, tasksModel }: Constructor) {
    this.#tasksModel = tasksModel;
    this.#boardContainerNode = containerNode;
    this.#renderedTaskCount = TASK_COUNT_PER_STEP;
    this.#currentSortType = SortType.DEFAULT;
    this.#taskPresenters = {};

    this.#noTasksComponent = new NoTaskView();
    this.#boardComponent = new BoardView();
    this.#sortComponent = new SortView(sorts);
    this.#taskListComponent = new TaskListView();
    this.#loadMoreButtonComponent = new LoadMoreButtonView();
  }

  #renderNoTask = () => {
    renderElement(
      this.#boardComponent,
      this.#noTasksComponent,
      RenderPosition.AFTER_BEGIN
    );
  };

  #renderSorts = () => {
    renderElement(
      this.#boardComponent,
      this.#sortComponent,
      RenderPosition.AFTER_BEGIN
    );

    this.#sortComponent.setOnSortTypeChange(this.#changeSortType);
  };

  #renderTask = (task: ITask) => {
    const taskPresenter = new TaskPresenter(
      this.#taskListComponent,
      this.#changeTask,
      this.#changeTaskMode
    );

    taskPresenter.init(task);

    this.#taskPresenters[task.id] = taskPresenter;
  };

  #changeTask = (task: ITask) => {
    this.#boardTasks = updateItem(this.#boardTasks, task, `id`);
    this.#initialTasks = updateItem(this.#initialTasks, task, `id`);
    this.#taskPresenters[task.id].init(task);
  };

  #renderTasks = (from: number, to: number) => {
    this.#boardTasks.slice(from, to).forEach((it) => this.#renderTask(it));
  };

  #getTasks = () => {
    return this.#tasksModel.getTasks();
  };

  #clearTaskList = () => {
    Object.values(this.#taskPresenters).forEach((it) => it.destroy());

    this.#renderedTaskCount = TASK_COUNT_PER_STEP;
  };

  #sortTasks = (sortType: SortType) => {
    switch (sortType) {
      case SortType.DATE_UP:
      case SortType.DATE_DOWN:
        this.#boardTasks.sort((a, b) => {
          const rank = getRankByType(a, b, sortType);

          return rank;
        });
        break;
      default:
        this.#boardTasks = this.#initialTasks.slice();
    }

    this.#currentSortType = sortType;
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
  };

  #renderLoadMoreButton = () => {
    renderElement(
      this.#boardComponent,
      this.#loadMoreButtonComponent,
      RenderPosition.BEFORE_END
    );

    this.#loadMoreButtonComponent.setOnClick(this.#loadMoreTasks);
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

  #loadMoreTasks = () => {
    this.#renderTasks(
      this.#renderedTaskCount,
      this.#renderedTaskCount + TASK_COUNT_PER_STEP
    );

    this.#renderedTaskCount += TASK_COUNT_PER_STEP;

    if (this.#renderedTaskCount >= this.#boardTasks.length) {
      removeElement(this.#loadMoreButtonComponent);
    }
  };

  #changeSortType = (sortType: SortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortTasks(sortType);
    this.#clearTaskList();
    this.#renderTaskList();
  };

  #changeTaskMode = () => {
    Object.values(this.#taskPresenters).forEach((it) => it.resetView());
  };

  public init(tasks: ITask[]) {
    this.#boardTasks = tasks.slice();
    this.#initialTasks = tasks.slice();

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
