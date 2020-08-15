import { generateTasks, generateFilters, renderElement } from '~/helpers';
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
const boardNode = new BoardView().node;
const sortNode = new SortView(sorts).node;
const taskListNode = new TaskListView().node;
const loadMoreButtonNode = new LoadMoreButtonView().node;
const noTaskNode = new NoTaskView().node;

const siteMainNode = document.querySelector(`.main`);
const siteHeaderNode = siteMainNode.querySelector(`.main__control`);

renderElement(siteHeaderNode, siteMenuNode, RenderPosition.BEFORE_END);
renderElement(siteMainNode, filterNode, RenderPosition.BEFORE_END);
renderElement(siteMainNode, boardNode, RenderPosition.BEFORE_END);
renderElement(boardNode, sortNode, RenderPosition.AFTER_BEGIN);
renderElement(boardNode, taskListNode, RenderPosition.BEFORE_END);

for (let i = 0; i < Math.min(tasks.length, TASK_COUNT_PER_STEP); i++) {
  renderElement(
    taskListNode,
    new TaskView(tasks[i]).node,
    RenderPosition.BEFORE_END
  );
}

if (tasks.length > TASK_COUNT_PER_STEP) {
  let renderedTaskCount = TASK_COUNT_PER_STEP;

  renderElement(boardNode, loadMoreButtonNode, RenderPosition.BEFORE_END);

  const loadMoreBtn = boardNode.querySelector(`.load-more`);

  const onShowMoreBtnClick = () => {
    tasks
      .slice(renderedTaskCount, renderedTaskCount + TASK_COUNT_PER_STEP)
      .forEach((it) => renderElement(
        taskListNode,
        new TaskView(it).node,
        RenderPosition.BEFORE_END
      ));

    renderedTaskCount += TASK_COUNT_PER_STEP;

    if (renderedTaskCount >= tasks.length) {
      loadMoreBtn.removeEventListener(`click`, onShowMoreBtnClick);
      loadMoreBtn.remove();
    }
  };

  loadMoreBtn.addEventListener(`click`, onShowMoreBtnClick);
}
