import { generateTasks, renderElement } from '~/helpers';
import {
  RenderPosition,
  MenuItem,
  UpdateType,
  FilterType,
} from '~/common/enums';
import BoardPresenter from '~/presenter/board/board';
import FilterPresenter from '~/presenter/filter/filter';
import TasksModel from '~/model/task/task';
import FilterModel from '~/model/filter/filter';
import SiteMenuView from '~/view/site-menu/site-menu';

const TASK_COUNT = 22;

const siteMainNode = document.querySelector(`.main`);
const siteHeaderNode = siteMainNode.querySelector(`.main__control`);

const tasks = generateTasks(TASK_COUNT);

const tasksModel = new TasksModel();
const filterModel = new FilterModel();

tasksModel.tasks = tasks;

const siteMenuComponent = new SiteMenuView();

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

const closeNewTaskForm = () => {
  const tasksInputNode = siteMenuComponent.node.querySelector(
    `[value=${MenuItem.TASKS}]`
  );

  (tasksInputNode as HTMLInputElement).disabled = false;
  siteMenuComponent.setMenuItem(MenuItem.TASKS);
};

const changeMenuItem = (menuItem: MenuItem) => {
  switch (menuItem) {
    case MenuItem.ADD_NEW_TASK: {
      const tasksInputNode = siteMenuComponent.node.querySelector(
        `[value=${MenuItem.TASKS}]`
      );

      boardPresenter.destroy();
      filterModel.setFilter(UpdateType.MAJOR, FilterType.ALL);
      boardPresenter.init();
      boardPresenter.createTask(closeNewTaskForm);
      (tasksInputNode as HTMLInputElement).disabled = true;
      break;
    }
    case MenuItem.TASKS:
      boardPresenter.init();
      break;
    case MenuItem.STATISTICS:
      boardPresenter.destroy();
      break;
  }
};

siteMenuComponent.setOnMenuClick(changeMenuItem);
renderElement(siteHeaderNode, siteMenuComponent, RenderPosition.BEFORE_END);

filterPresenter.init();
boardPresenter.init();
