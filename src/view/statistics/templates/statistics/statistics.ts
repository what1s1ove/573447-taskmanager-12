import { countCompletedTasks } from '~/helpers';
import { IStatistic } from '~/common/interfaces';

const createStatisticsTemplate = (statistics: IStatistic) => {
  const { tasks, dateFrom, dateTo } = statistics;
  const completedTaskCount = countCompletedTasks(tasks, dateFrom, dateTo);

  return `<section class="statistic container">
    <div class="statistic__line">
      <div class="statistic__period">
        <h2 class="statistic__period-title">Task Activity DIAGRAM</h2>
        <div class="statistic-input-wrap">
          <input class="statistic__period-input" type="text" placeholder="">
        </div>
        <p class="statistic__period-result">
          In total for the specified period
          <span class="statistic__task-found">${completedTaskCount}</span>
          tasks were fulfilled.
        </p>
      </div>
      <div class="statistic__line-graphic">
        <canvas class="statistic__days" width="550" height="150"></canvas>
      </div>
    </div>
    <div class="statistic__circle">
      <div class="statistic__colors-wrap">
        <canvas class="statistic__colors" width="400" height="300"></canvas>
      </div>
    </div>
  </section>`;
};

export { createStatisticsTemplate };
