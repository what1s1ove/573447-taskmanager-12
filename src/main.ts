import { renderTemplate, generateTasks, generateFilters } from '~/helpers';
import { createSiteMenuTemplate } from '~/view/site-menu/site-menu';
import { createFilterTemplate } from '~/view/filter/filter';
import { createBoardTemplate } from '~/view/board/board';
import { createTaskEditTemplate } from '~/view/task-edit/task-edit';
import { createTaskTemplate } from '~/view/task/task';
import { createLoadMoreButtonTemplate } from '~/view/load-more-button/load-more-button';
import { RenderPosition } from './common/enums';

const TASK_COUNT = 22;
const TASK_COUNT_PER_STEP = 8;

const tasks = generateTasks(TASK_COUNT);
const filters = generateFilters(tasks);

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

renderTemplate(
  siteHeaderElement,
  createSiteMenuTemplate(),
  RenderPosition.BEFORE_END
);
renderTemplate(
  siteMainElement,
  createFilterTemplate(filters),
  RenderPosition.BEFORE_END
);
renderTemplate(
  siteMainElement,
  createBoardTemplate(),
  RenderPosition.BEFORE_END
);

const boardElement = siteMainElement.querySelector(`.board`);
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

  renderTemplate(
    boardElement,
    createLoadMoreButtonTemplate(),
    RenderPosition.BEFORE_END
  );

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
