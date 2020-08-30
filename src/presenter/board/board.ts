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
    this.#taskPresenters[task.id].init(task);
  };

  #renderTasks = (tasks: ITask[]) => {
    tasks.forEach((it) => this.#renderTask(it));
  };

  #clearTaskList = () => {
    Object.values(this.#taskPresenters).forEach((it) => it.destroy());

    this.#renderedTaskCount = TASK_COUNT_PER_STEP;
  };

  #renderTaskList = () => {
    const taskCount = this.tasks.length;
    const tasks = this.tasks.slice(0, Math.min(taskCount, TASK_COUNT_PER_STEP));

    this.#renderTasks(tasks);

    if (taskCount > TASK_COUNT_PER_STEP) {
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
    const isNoTaskComponentRender = this.tasks.every((task) => task.isArchive);

    if (isNoTaskComponentRender) {
      this.#renderNoTask();

      return;
    }

    this.#renderSorts();
    this.#renderTaskList();
  };

  #loadMoreTasks = () => {
    const taskCount = this.tasks.length;
    const newRenderedTaskCount = Math.min(taskCount, this.#renderedTaskCount + TASK_COUNT_PER_STEP);
    const tasks = this.tasks.slice(this.#renderedTaskCount, newRenderedTaskCount);

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
    this.#clearTaskList();
    this.#renderTaskList();
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
