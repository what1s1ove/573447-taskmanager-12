import {
  generateTasks,
  generateFilters,
  renderElement,
} from '~/helpers';
import { ITask } from './common/interfaces';
import { RenderPosition, SortType, KeyboardKey } from '~/common/enums';
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

const siteMenuNode = new SiteMenuView().node;
const filterNode = new FilterView(filters).node;

const sortNode = new SortView(sorts).node;
const noTaskNode = new NoTaskView().node;

const siteMainNode = document.querySelector(`.main`);
const siteHeaderNode = siteMainNode.querySelector(`.main__control`);

const renderTask = (container: Element, task: ITask) => {
  const taskComponent = new TaskView(task);
  const taskEditComponent = new TaskEditView(task);

  const replaceWith = (a: Element, b: Element) => a.replaceWith(b);

  const replaceCardToForm = () => replaceWith(taskComponent.node, taskEditComponent.node);

  const replaceFormToCard = () => replaceWith(taskEditComponent.node, taskComponent.node);

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

  renderElement(container, taskComponent.node, RenderPosition.BEFORE_END);
};

const renderBoard = (boardContainer: Element, boardTasks: ITask[]) => {
  const boardNode = new BoardView().node;
  const taskListNode = new TaskListView().node;
  const isNoTaskRender = boardTasks.every((it) => it.isArchive);

  renderElement(boardContainer, boardNode, RenderPosition.BEFORE_END);
  renderElement(boardNode, taskListNode, RenderPosition.BEFORE_END);

  if (isNoTaskRender) {
    renderElement(boardNode, noTaskNode, RenderPosition.AFTER_BEGIN);

    return;
  }

  renderElement(boardNode, sortNode, RenderPosition.AFTER_BEGIN);

  boardTasks
    .slice(0, Math.min(boardTasks.length, TASK_COUNT_PER_STEP))
    .forEach((it) => renderTask(taskListNode, it));

  if (boardTasks.length > TASK_COUNT_PER_STEP) {
    let renderedTaskCount = TASK_COUNT_PER_STEP;

    const loadMoreButtonComponent = new LoadMoreButtonView();

    renderElement(boardNode, loadMoreButtonComponent.node, RenderPosition.BEFORE_END);

    loadMoreButtonComponent.setOnClick(() => {
      boardTasks
        .slice(renderedTaskCount, renderedTaskCount + TASK_COUNT_PER_STEP)
        .forEach((it) => renderTask(taskListNode, it));

      renderedTaskCount += TASK_COUNT_PER_STEP;

      if (renderedTaskCount >= boardTasks.length) {
        loadMoreButtonComponent.node.remove();
        loadMoreButtonComponent.removeElement();
      }
    });
  }
};

renderElement(siteHeaderNode, siteMenuNode, RenderPosition.BEFORE_END);
renderElement(siteMainNode, filterNode, RenderPosition.BEFORE_END);

renderBoard(siteMainNode, tasks);
