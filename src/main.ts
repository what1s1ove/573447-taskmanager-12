import { generateTasks, generateFilters, renderElement } from '~/helpers';
import { RenderPosition } from '~/common/enums';
import BoardPresenter from '~/presenter/board/board';
import SiteMenuView from '~/view/site-menu/site-menu';
import FilterView from './view/filter/filter';

const TASK_COUNT = 22;

const tasks = generateTasks(TASK_COUNT);
const filters = generateFilters(tasks);

const siteMenuComponent = new SiteMenuView();
const filterComponent = new FilterView(filters);

const siteMainNode = document.querySelector(`.main`);
const siteHeaderNode = siteMainNode.querySelector(`.main__control`);

renderElement(siteHeaderNode, siteMenuComponent, RenderPosition.BEFORE_END);
renderElement(siteMainNode, filterComponent, RenderPosition.BEFORE_END);

new BoardPresenter(siteMainNode).init(tasks);
