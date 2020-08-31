import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {
  getCurrentDate,
  countTasksByColor,
  getUniqItems,
  getDatesInRange,
  countTasksInDateRange,
  parseChartDate,
} from '~/helpers';
import { ITask } from '~/common/interfaces';
import { colorToHex } from '~/common/maps';

const getDateFrom = (daysToFullWeek: number) => {
  const today = getCurrentDate();

  today.setDate(today.getDate() - daysToFullWeek);

  return today;
};

const initColorsChart = (container: HTMLCanvasElement, tasks: ITask[]) => {
  const taskColors = tasks.map((task) => task.color);
  const uniqColors = getUniqItems(taskColors);
  const taskByColorCounts = uniqColors.map((color) => countTasksByColor(tasks, color));
  const hexColors = uniqColors.map((color) => colorToHex[color]);

  const ColorsChart = new Chart(container, {
    plugins: [ChartDataLabels],
    type: `pie`,
    data: {
      labels: uniqColors,
      datasets: [
        {
          data: taskByColorCounts,
          backgroundColor: hexColors,
        },
      ],
    },
    options: {
      plugins: {
        datalabels: {
          display: false,
        },
      },
      tooltips: {
        callbacks: {
          label: (tooltipItem, data) => {
            const allData = data.datasets[tooltipItem.datasetIndex]
              .data as number[];
            const tooltipData = allData[tooltipItem.index];
            const total = allData.reduce(
              (acc, it) => acc + parseFloat(it.toString()),
              0
            );
            const tooltipPercentage = Math.round((tooltipData / total) * 100);
            return `${tooltipData} TASKS — ${tooltipPercentage}%`;
          },
        },
        displayColors: false,
        backgroundColor: `#ffffff`,
        bodyFontColor: `#000000`,
        borderColor: `#000000`,
        borderWidth: 1,
        cornerRadius: 0,
        xPadding: 15,
        yPadding: 15,
      },
      title: {
        display: true,
        text: `DONE BY: COLORS`,
        fontSize: 16,
        fontColor: `#000000`,
      },
      legend: {
        position: `left`,
        labels: {
          boxWidth: 15,
          padding: 25,
          fontStyle: `500`,
          fontColor: `#000000`,
          fontSize: 13,
        },
      },
    },
  });

  return ColorsChart;
};

const initDaysChart = (
  container: HTMLCanvasElement,
  tasks: ITask[],
  dateFrom: Date,
  dateTo: Date
) => {
  const dates = getDatesInRange(dateFrom, dateTo);
  const parsedDates = dates.map(parseChartDate);
  const taskInDateRangeCounts = countTasksInDateRange(dates, tasks);

  const DaysChart = new Chart(container, {
    plugins: [ChartDataLabels],
    type: `line`,
    data: {
      labels: parsedDates,
      datasets: [
        {
          data: [taskInDateRangeCounts],
          backgroundColor: `transparent`,
          borderColor: `#000000`,
          borderWidth: 1,
          lineTension: 0,
          pointRadius: 8,
          pointHoverRadius: 8,
          pointBackgroundColor: `#000000`,
        },
      ],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 8,
          },
          color: `#ffffff`,
        },
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              display: false,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
          },
        ],
        xAxes: [
          {
            ticks: {
              fontStyle: `bold`,
              fontColor: `#000000`,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
          },
        ],
      },
      legend: {
        display: false,
      },
      layout: {
        padding: {
          top: 10,
        },
      },
      tooltips: {
        enabled: false,
      },
    },
  });

  return DaysChart;
};

export { getDateFrom, initColorsChart, initDaysChart };
