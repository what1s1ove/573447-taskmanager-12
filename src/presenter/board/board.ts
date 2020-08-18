import { renderElement, removeElement, getRankByType } from '~/helpers';
import { ITask } from '~/common/interfaces';
import { RenderPosition, SortType } from '~/common/enums';
import TaskPresenter from '~/presenter/task/task';
import NoTaskView from '~/view/no-tasks/no-tasks';
import BoardView from '~/view/board/board';
import SortView from '~/view/sort/sort';
import TaskListView from '~/view/task-list/task-list';
import LoadMoreButtonView from '~/view/load-more-button/load-more-button';

const START_TASK_RENDER_COUNT = 0;
const TASK_COUNT_PER_STEP = 8;

const sorts = Object.values(SortType);

class Board {
  #boardTasks: ITask[];

  #initialTasks: ITask[];

  #renderedTaskCount: number;

  #currentSortType: SortType;

  #boardContainerNode: Element;

  #noTasksComponent: NoTaskView;

  #boardComponent: BoardView;

  #sortComponent: SortView;

  #taskListComponent: TaskListView;

  #loadMoreButtonComponent: LoadMoreButtonView;

  constructor(boardContainerNode: Element) {
    this.#boardContainerNode = boardContainerNode;
    this.#renderedTaskCount = TASK_COUNT_PER_STEP;
    this.#currentSortType = SortType.DEFAULT;

    this.#noTasksComponent = new NoTaskView();
    this.#boardComponent = new BoardView();
    this.#sortComponent = new SortView(sorts);
    this.#taskListComponent = new TaskListView();
    this.#loadMoreButtonComponent = new LoadMoreButtonView();
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

    this.#sortComponent.setOnSortTypeChange(this.#changeSortType);
  };

  #renderTask = (task: ITask) => {
    new TaskPresenter(this.#taskListComponent).init(task);
  };

  #renderTasks = (from: number, to: number) => {
    this.#boardTasks.slice(from, to).forEach((it) => this.#renderTask(it));
  };

  #clearTaskList = () => {
    this.#taskListComponent.node.innerHTML = ``;
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
    renderElement(this.#boardComponent, this.#loadMoreButtonComponent, RenderPosition.BEFORE_END);

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
    this.#renderTasks(this.#renderedTaskCount, this.#renderedTaskCount + TASK_COUNT_PER_STEP);

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
