import { createSiteMenuTemplate } from "~/view/site-menu";
import { createFilterTemplate } from "~/view/filter";
import { createBoardTemplate } from "~/view/board";
import { createTaskEditTemplate } from "~/view/task-edit";
import { createTaskTemplate } from "~/view/task";
import { createLoadMoreButtonTemplate } from "~/view/load-more-button";
import { renderTemplate } from "~/helpers";
import { AdjacentHTMLPlace } from "./common/enums";

const TASK_COUNT = 3;

// const tasks = Array.from(new Array(TASK_COUNT), () => generateTask());

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

renderTemplate(
  siteHeaderElement,
  createSiteMenuTemplate(),
  AdjacentHTMLPlace.BEFORE_END
);
renderTemplate(
  siteMainElement,
  createFilterTemplate(),
  AdjacentHTMLPlace.BEFORE_END
);
renderTemplate(
  siteMainElement,
  createBoardTemplate(),
  AdjacentHTMLPlace.BEFORE_END
);

const boardElement = siteMainElement.querySelector(`.board`);
const taskListElement = boardElement.querySelector(`.board__tasks`);

renderTemplate(
  taskListElement,
  createTaskEditTemplate(),
  AdjacentHTMLPlace.BEFORE_END
);

for (let i = 0; i < TASK_COUNT; i++) {
  renderTemplate(
    taskListElement,
    createTaskTemplate(),
    AdjacentHTMLPlace.BEFORE_END
  );
}

renderTemplate(
  boardElement,
  createLoadMoreButtonTemplate(),
  AdjacentHTMLPlace.BEFORE_END
);
