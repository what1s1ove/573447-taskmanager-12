import { Api } from '~/services';
import { generateTasks, renderElement, removeElement } from '~/helpers';
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
import StatisticsView from '~/view/statistics/statistics';

const TASK_COUNT = 22;

const AUTHORIZATION = `Basic 1488`;
const END_POINT = `https://12.ecmascript.pages.academy/task-manager`;

const siteMainNode = document.querySelector(`.main`);
const siteHeaderNode = siteMainNode.querySelector(`.main__control`);

const tasks = generateTasks(TASK_COUNT);

const api = new Api(END_POINT, AUTHORIZATION);

api.getTasks().then((tasks) => {
  console.log(tasks);
});

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
  const tasksInputNode: HTMLInputElement = siteMenuComponent.node.querySelector(
    `[value=${MenuItem.TASKS}]`
  );

  tasksInputNode.disabled = false;
  siteMenuComponent.setMenuItem(MenuItem.TASKS);
};

let statisticsComponent: StatisticsView | null = null;

const changeMenuItem = (menuItem: MenuItem) => {
  switch (menuItem) {
    case MenuItem.ADD_NEW_TASK: {
      const tasksInputNode: HTMLInputElement = siteMenuComponent.node.querySelector(
        `[value=${MenuItem.TASKS}]`
      );

      removeElement(statisticsComponent);
      boardPresenter.destroy();
      filterModel.setFilter(UpdateType.MAJOR, FilterType.ALL);
      boardPresenter.init();
      boardPresenter.createTask(closeNewTaskForm);
      tasksInputNode.disabled = true;
      break;
    }
    case MenuItem.TASKS: {
      boardPresenter.init();
      removeElement(statisticsComponent);
      break;
    }
    case MenuItem.STATISTICS: {
      boardPresenter.destroy();
      statisticsComponent = new StatisticsView({
        tasks: tasksModel.tasks
      });
      renderElement(siteMainNode, statisticsComponent, RenderPosition.BEFORE_END);
      break;
    }
  }
};

siteMenuComponent.setOnMenuClick(changeMenuItem);
renderElement(siteHeaderNode, siteMenuComponent, RenderPosition.BEFORE_END);

filterPresenter.init();
boardPresenter.init();
