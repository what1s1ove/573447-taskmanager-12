import { ITask } from '../task';

interface IStatistic {
  tasks: ITask[];
  dateFrom: Date;
  dateTo: Date;
}

export { IStatistic };
