import { Api, Store, Provider } from '~/services';
import { renderElement, removeElement } from '~/helpers';
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

const AUTHORIZATION = `Basic 14880`;
const END_POINT = `https://12.ecmascript.pages.academy/task-manager`;
const STORE_PREFIX = `taskmanager-localstorage`;
const STORE_VER = `v12`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const siteMainNode = document.querySelector(`.main`) as HTMLElement;
const siteHeaderNode = siteMainNode.querySelector(`.main__control`) as HTMLElement;

const api = new Api({
  endPoint: END_POINT,
  auth: AUTHORIZATION
});
const store = new Store({
  key: STORE_NAME,
  storage: localStorage,
});
const apiWithProvider = new Provider({
  api,
  store,
});

const tasksModel = new TasksModel();
const filterModel = new FilterModel();

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
  api: apiWithProvider,
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

filterPresenter.init();
boardPresenter.init();

apiWithProvider
  .getTasks()
  .then((it) => {
    tasksModel.setTasks(UpdateType.INIT, it);
  })
  .catch(() => {
    tasksModel.setTasks(UpdateType.INIT, []);
  })
  .finally(() => {
    renderElement(siteHeaderNode, siteMenuComponent, RenderPosition.BEFORE_END);
    siteMenuComponent.setOnMenuClick(changeMenuItem);
  });

window.addEventListener(`load`, () => {
  navigator.serviceWorker
    .register(`/sw.js`)
    .then(() => {
      console.log(`ServiceWorker available`); // eslint-disable-line
    })
    .catch(() => {
      console.error(`ServiceWorker isn't available`); // eslint-disable-line
    });
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  apiWithProvider.syncTasks();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
