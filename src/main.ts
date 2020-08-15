import {
  generateTasks,
  generateFilters,
  renderElement,
} from '~/helpers';
import { ITask } from './common/interfaces';
import { RenderPosition, SortType } from '~/common/enums';
import SiteMenuView from '~/view/site-menu/site-menu';
import BoardView from '~/view/board/board';
import SortView from './view/sort/sort';
import TaskListView from './view/task-list/task-list';
import FilterView from './view/filter/filter';
import TaskView from './view/task/task';
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
    .forEach((it) => renderElement(
      taskListNode,
      new TaskView(it).node,
      RenderPosition.BEFORE_END
    ));

  if (boardTasks.length > TASK_COUNT_PER_STEP) {
    let renderedTaskCount = TASK_COUNT_PER_STEP;

    const loadMoreButtonComponent = new LoadMoreButtonView();

    renderElement(boardNode, loadMoreButtonComponent.node, RenderPosition.BEFORE_END);

    loadMoreButtonComponent.setOnClick(() => {
      boardTasks
        .slice(renderedTaskCount, renderedTaskCount + TASK_COUNT_PER_STEP)
        .forEach((it) => renderElement(
          taskListNode,
          new TaskView(it).node,
          RenderPosition.BEFORE_END
        ));

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
