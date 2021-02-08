import { SuccessHTTPStatusRange, HttpMethod } from '~/common/enums';
import { ITask, IFetchedTask } from '~/common/interfaces';
import TasksModel from '~/model/task/task';
import { ApiRequest } from './common';
import { INewTask, SyncTasksResponse } from '~/common/types';

type Constructor = {
  endPoint: string,
  auth: string
};

class Api {
  #endPoint: string;

  #authorization: string;

  constructor({ endPoint, auth }: Constructor) {
    this.#endPoint = endPoint;
    this.#authorization = auth;
  }

  static checkStatus(response: Response) {
    if (
      response.status < SuccessHTTPStatusRange.MIN
      && response.status > SuccessHTTPStatusRange.MAX
    ) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  static toJSON<T>(response: Response): Promise<T> {
    return response.json();
  }

  static catchError(err: Error): never {
    throw err;
  }

  #load = ({
    url,
    method = HttpMethod.GET,
    body = null,
    headers = new Headers(),
  }: ApiRequest) => {
    headers.append(`Authorization`, this.#authorization);

    return fetch(`${this.#endPoint}/${url}`, { method, body, headers })
      .then(Api.checkStatus)
      .catch(Api.catchError);
  };

  public getTasks() {
    return this.#load({ url: `tasks` })
      .then((res) => Api.toJSON<IFetchedTask[]>(res))
      .then((tasks) => tasks.map(TasksModel.adaptToClient));
  }

  public updateTask(task: ITask) {
    return this.#load({
      url: `tasks/${task.id}`,
      method: HttpMethod.PUT,
      body: JSON.stringify(TasksModel.adaptToServer(task)),
      headers: new Headers({ 'Content-Type': `application/json` }),
    })
      .then((res) => Api.toJSON<IFetchedTask>(res))
      .then(TasksModel.adaptToClient);
  }

  public addTask(task: INewTask) {
    return this.#load({
      url: `tasks`,
      method: HttpMethod.POST,
      body: JSON.stringify(TasksModel.adaptToSaveToServer(task)),
      headers: new Headers({ 'Content-Type': `application/json` }),
    })
      .then((res) => Api.toJSON<IFetchedTask>(res))
      .then(TasksModel.adaptToClient);
  }

  public deleteTask(task: ITask) {
    return this.#load({
      url: `tasks/${task.id}`,
      method: HttpMethod.DELETE,
    });
  }

  public syncTasks(data: IFetchedTask[]) {
    return this.#load({
      url: `tasks/sync`,
      method: HttpMethod.POST,
      body: JSON.stringify(data),
      headers: new Headers({ 'Content-Type': `application/json` }),
    }).then((res) => Api.toJSON<SyncTasksResponse>(res));
  }
}

export default Api;
