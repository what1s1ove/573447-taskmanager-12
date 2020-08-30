import { generateTasks, renderElement } from '~/helpers';
import { RenderPosition } from '~/common/enums';
import BoardPresenter from '~/presenter/board/board';
import FilterPresenter from '~/presenter/filter/filter';
import TasksModel from '~/model/task/task';
import FilterModel from '~/model/filter/filter';
import SiteMenuView from '~/view/site-menu/site-menu';

const TASK_COUNT = 22;

const tasks = generateTasks(TASK_COUNT);

const tasksModel = new TasksModel();
tasksModel.tasks = tasks;

const filterModel = new FilterModel();

const siteMenuComponent = new SiteMenuView();

const siteMainNode = document.querySelector(`.main`);
const siteHeaderNode = siteMainNode.querySelector(`.main__control`);

renderElement(siteHeaderNode, siteMenuComponent, RenderPosition.BEFORE_END);

const filterPresenter = new FilterPresenter({
  filterModel,
  tasksModel,
  containerNode: siteMainNode,
});

const boardPresenter = new BoardPresenter({
  filterModel,
  tasksModel,
  containerNode: siteMainNode,
});

document.querySelector(`#control__new-task`).addEventListener(`click`, (evt) => {
  evt.preventDefault();

  boardPresenter.createTask();
});

filterPresenter.init();
boardPresenter.init();
