import {
  generateTasks,
  generateFilters,
  renderElement,
  removeElement,
  replaceWithElement
} from '~/helpers';
import { ITask } from './common/interfaces';
import { RenderPosition, SortType, KeyboardKey } from '~/common/enums';
import Abstract from './view/abstract/abstract';
import SiteMenuView from '~/view/site-menu/site-menu';
import BoardView from '~/view/board/board';
import SortView from './view/sort/sort';
import TaskListView from './view/task-list/task-list';
import FilterView from './view/filter/filter';
import TaskView from './view/task/task';
import TaskEditView from './view/task-edit/task-edit';
import LoadMoreButtonView from '~/view/load-more-button/load-more-button';
import NoTaskView from '~/view/no-tasks/no-tasks';

const TASK_COUNT = 22;
const TASK_COUNT_PER_STEP = 8;

const tasks = generateTasks(TASK_COUNT);
const sorts = Object.values(SortType);
const filters = generateFilters(tasks);

const siteMenuComponent = new SiteMenuView();
const filterComponent = new FilterView(filters);

const siteMainNode = document.querySelector(`.main`);
const siteHeaderNode = siteMainNode.querySelector(`.main__control`);

const renderTask = (container: Abstract, task: ITask) => {
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

  renderElement(container, taskComponent, RenderPosition.BEFORE_END);
};

const renderBoard = (boardContainer: Element, boardTasks: ITask[]) => {
  const boardComponent = new BoardView();
  const taskListComponent = new TaskListView();
  const sortComponent = new SortView(sorts);
  const noTaskComponent = new NoTaskView();

  const isNoTaskRender = boardTasks.every((it) => it.isArchive);

  renderElement(boardContainer, boardComponent, RenderPosition.BEFORE_END);
  renderElement(boardComponent, taskListComponent, RenderPosition.BEFORE_END);

  if (isNoTaskRender) {
    renderElement(boardComponent, noTaskComponent, RenderPosition.AFTER_BEGIN);

    return;
  }

  renderElement(boardComponent, sortComponent, RenderPosition.AFTER_BEGIN);

  boardTasks
    .slice(0, Math.min(boardTasks.length, TASK_COUNT_PER_STEP))
    .forEach((it) => renderTask(taskListComponent, it));

  if (boardTasks.length > TASK_COUNT_PER_STEP) {
    let renderedTaskCount = TASK_COUNT_PER_STEP;

    const loadMoreButtonComponent = new LoadMoreButtonView();

    renderElement(boardComponent, loadMoreButtonComponent, RenderPosition.BEFORE_END);

    loadMoreButtonComponent.setOnClick(() => {
      boardTasks
        .slice(renderedTaskCount, renderedTaskCount + TASK_COUNT_PER_STEP)
        .forEach((it) => renderTask(taskListComponent, it));

      renderedTaskCount += TASK_COUNT_PER_STEP;

      if (renderedTaskCount >= boardTasks.length) {
        removeElement(loadMoreButtonComponent)
      }
    });
  }
};

renderElement(siteHeaderNode, siteMenuComponent, RenderPosition.BEFORE_END);
renderElement(siteMainNode, filterComponent, RenderPosition.BEFORE_END);

renderBoard(siteMainNode, tasks);
