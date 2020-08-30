import flatpickr from 'flatpickr';
import { Instance } from 'flatpickr/dist/types/instance';
import { getCurrentDate } from '~/helpers';
import { ITask, IStatistic } from '~/common/interfaces';
import SmartView from '~/view/smart/smart';
import { createStatisticsTemplate } from './templates/statistics/statistics';
import { getDateFrom, initColorsChart, initDaysChart } from './helpers';

const DAYS_TO_FULL_WEEK = 6;

type Constructor = {
  tasks: ITask[];
};

class Statistics extends SmartView<IStatistic> {
  protected data: IStatistic;

  #datepicker: Instance | null;

  #colorsCart: Chart | null;

  #daysChart: Chart | null;

  constructor({ tasks }: Constructor) {
    super();

    this.data = {
      tasks,
      dateFrom: getDateFrom(DAYS_TO_FULL_WEEK),
      dateTo: getCurrentDate(),
    };

    this.#colorsCart = null;
    this.#daysChart = null;

    this.#setCharts();
    this.#setDatepicker();
  }

  get template() {
    return createStatisticsTemplate(this.data);
  }

  #resetChars = () => {
    if (this.#colorsCart || this.#daysChart) {
      this.#colorsCart = null;
      this.#daysChart = null;
    }
  };

  #onDateChange = ([dateFrom, dateTo]: Date[]) => {
    if (!dateFrom || !dateTo) {
      return;
    }

    this.updateData({
      dateFrom,
      dateTo,
    });
  };

  #setDatepicker = () => {
    if (this.#datepicker) {
      this.#datepicker.destroy();
      this.#datepicker = null;
    }

    const statisticsNode = this.node.querySelector(`.statistic__period-input`);

    this.#datepicker = flatpickr(statisticsNode, {
      mode: `range`,
      dateFormat: `j F`,
      defaultDate: [this.data.dateFrom, this.data.dateTo],
      onChange: this.#onDateChange,
    });
  };

  #setCharts = () => {
    this.#resetChars();

    const { tasks, dateFrom, dateTo } = this.data;
    const colorsCanvasNode = this.node.querySelector(`.statistic__colors`) as HTMLCanvasElement;
    const daysCanvasNode = this.node.querySelector(`.statistic__days`) as HTMLCanvasElement;

    this.#colorsCart = initColorsChart(colorsCanvasNode, tasks);
    this.#daysChart = initDaysChart(daysCanvasNode, tasks, dateFrom, dateTo);
  };

  initListeners = () => {
    this.#setCharts();
    this.#setDatepicker();
  };

  public removeElement() {
    super.removeElement();

    this.#resetChars();

    if (this.#datepicker) {
      this.#datepicker.destroy();
      this.#datepicker = null;
    }
  }
}

export default Statistics;
