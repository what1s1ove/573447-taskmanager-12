import { generateTasks, generateFilters, renderElement } from '~/helpers';
import { RenderPosition, FilterType } from '~/common/enums';
import BoardPresenter from '~/presenter/board/board';
import TasksModel from '~/model/task/task';
import FilterModel from '~/model/filter/filter';
import SiteMenuView from '~/view/site-menu/site-menu';
import FilterView from './view/filter/filter';

const TASK_COUNT = 22;

const tasks = generateTasks(TASK_COUNT);
const filters = generateFilters(tasks);

const tasksModel = new TasksModel();
tasksModel.tasks = tasks;

const filterModel = new FilterModel();

const siteMenuComponent = new SiteMenuView();
const filterComponent = new FilterView({
  filters,
  currentFilter: FilterType.ALL,
});

const siteMainNode = document.querySelector(`.main`);
const siteHeaderNode = siteMainNode.querySelector(`.main__control`);

renderElement(siteHeaderNode, siteMenuComponent, RenderPosition.BEFORE_END);
renderElement(siteMainNode, filterComponent, RenderPosition.BEFORE_END);

const boardPresenter = new BoardPresenter({
  containerNode: siteMainNode,
  tasksModel,
});

boardPresenter.init();
