import {
  renderTemplate,
  generateTasks,
  generateFilters,
  renderElement,
} from '~/helpers';
import { RenderPosition, SortType } from '~/common/enums';
import SiteMenuView from '~/view/site-menu/site-menu';
import BoardView from '~/view/board/board';
import SortView from './view/sort/sort';
import { createFilterTemplate } from '~/view/filter/filter';
import { createTaskEditTemplate } from '~/view/task-edit/task-edit';
import { createTaskTemplate } from '~/view/task/task';
import LoadMoreButtonView from '~/view/load-more-button/load-more-button';

const TASK_COUNT = 22;
const TASK_COUNT_PER_STEP = 8;

const tasks = generateTasks(TASK_COUNT);
const sorts = Object.values(SortType);
const filters = generateFilters(tasks);

const siteMenuNode = new SiteMenuView().node;
const boardNode = new BoardView().node;
const sortNode = new SortView(sorts).node;
const loadMoreButtonNode = new LoadMoreButtonView().node;

const siteMainNode = document.querySelector(`.main`);
const siteHeaderNode = siteMainNode.querySelector(`.main__control`);

renderElement(siteHeaderNode, siteMenuNode, RenderPosition.BEFORE_END);
renderTemplate(
  siteMainNode,
  createFilterTemplate(filters),
  RenderPosition.BEFORE_END
);
renderElement(siteMainNode, boardNode, RenderPosition.BEFORE_END);
renderElement(boardNode, sortNode, RenderPosition.AFTER_BEGIN);

const boardElement = siteMainNode.querySelector(`.board`);
const taskListElement = boardElement.querySelector(`.board__tasks`);

renderTemplate(
  taskListElement,
  createTaskEditTemplate(tasks[0]),
  RenderPosition.BEFORE_END
);

for (let i = 1; i < Math.min(tasks.length, TASK_COUNT_PER_STEP); i++) {
  renderTemplate(
    taskListElement,
    createTaskTemplate(tasks[i]),
    RenderPosition.BEFORE_END
  );
}

if (tasks.length > TASK_COUNT_PER_STEP) {
  let renderedTaskCount = TASK_COUNT_PER_STEP;

  renderElement(boardElement, loadMoreButtonNode, RenderPosition.BEFORE_END);

  const loadMoreBtn = boardElement.querySelector(`.load-more`);

  const onShowMoreBtnClick = () => {
    tasks
      .slice(renderedTaskCount, renderedTaskCount + TASK_COUNT_PER_STEP)
      .map((it) => renderTemplate(
        taskListElement,
        createTaskTemplate(it),
        RenderPosition.BEFORE_END
      ))
      .join(``);

    renderedTaskCount += TASK_COUNT_PER_STEP;

    if (renderedTaskCount >= tasks.length) {
      loadMoreBtn.removeEventListener(`click`, onShowMoreBtnClick);
      loadMoreBtn.remove();
    }
  };

  loadMoreBtn.addEventListener(`click`, onShowMoreBtnClick);
}
