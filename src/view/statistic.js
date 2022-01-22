import AbstractView from "./abstract.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {getFormatDuration} from '../utils/date.js';
import {EVENT_TRANSPORT, EVENT_EMOJI} from "../mock/event.js";
import {Chart, BarElement, BarController, CategoryScale, LinearScale, Title} from "chart.js";
Chart.register(BarElement, BarController, CategoryScale, LinearScale, Title);

const ChartSettings = {
  BAR_HEIGHT: 50,
  BAR_THICKNESS: 44,
  MIN_BAR_LENGTH: 50,
  BAR_COLOR: `#ffffff`,
  TEXT_COLOR: `#000000`,
  TEXT_FONT_SIZE: 13,
  TITLE_PADDING_TOP: 50,
  TITLE_PADDING_BOTTOM: 30,
  TITLE_FONT_SIZE: 23,
  TITLE_POSITION: `left`,
  DATA_LABELS_PADDING: 10,
  DATA_LABELS_ANCHOR: `end`,
  DATA_LABELS_ALIGN: `start`,
  Y_LABELS_PADDING: 5,
};

const statisticsType = {
  money: {
    name: `money`,
    labelFormat: (val) => `€ ${val}`,
  },
  transport: {
    name: `transport`,
    labelFormat: (val) => `${val}x`,
  },
  time: {
    name: `time`,
    labelFormat: (val) => `${getFormatDuration(val)}`,
  },
};

const renderChart = (ctx, title, labelFormat, data) => {
  ctx.height = ChartSettings.BAR_HEIGHT * Object.keys(data).length;

  return new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: `bar`,
    data: {
      labels: Object.keys(data),
      datasets: [{
        data: Object.values(data),
        backgroundColor: ChartSettings.BAR_COLOR,
        hoverBackgroundColor: ChartSettings.BAR_COLOR,
        barThickness: ChartSettings.BAR_THICKNESS,
        minBarLength: ChartSettings.MIN_BAR_LENGTH,
      }],
    },
    options: {
      indexAxis: `y`,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
        },
        datalabels: {
          padding: ChartSettings.DATA_LABELS_PADDING,
          font: {
            size: ChartSettings.TEXT_FONT_SIZE,
          },
          color: ChartSettings.TEXT_COLOR,
          anchor: ChartSettings.DATA_LABELS_ANCHOR,
          align: ChartSettings.DATA_LABELS_ALIGN,
          formatter: labelFormat,
        },
        title: {
          display: true,
          padding: {
            top: ChartSettings.TITLE_PADDING_TOP,
            bottom: ChartSettings.TITLE_PADDING_BOTTOM,
          },
          text: title,
          font: {
            size: ChartSettings.TITLE_FONT_SIZE,
          },
          color: ChartSettings.TEXT_COLOR,
          position: ChartSettings.TITLE_POSITION,
        },
      },
      scales: {
        y: {
          ticks: {
            padding: ChartSettings.Y_LABELS_PADDING,
            font: {
              size: ChartSettings.TEXT_FONT_SIZE,
            },
            color: ChartSettings.TEXT_COLOR,
          },
          grid: {
            display: false,
            drawBorder: false,
          },
        },
        x: {
          beginAtZero: true,
          ticks: {
            display: false,
          },
          grid: {
            display: false,
            drawBorder: false,
          },

        },
      },
    },
  });
};

const createStatisticTemplate = () => {
  return (
    `<section class="statistics">
      <h2 class="visually-hidden">Trip statistics</h2>
      ${Object.values(statisticsType).map((item) => `<div class="statistics__item">
        <canvas class="statistics__chart  statistics__chart--${item.name}" width="900"></canvas>
      </div>`).join(``)}
    </section>`
  );
};

export default class StatisticView extends AbstractView {
  constructor(events) {
    super();

    this._data = events;

    this._moneyChart = null;
    this._transportChart = null;
    this._timeSpendChart = null;

    this._setCharts();
  }

  getTemplate() {
    return createStatisticTemplate();
  }

  _setCharts() {
    if (this._moneyChart !== null) {
      this._moneyChart = null;
    }

    if (this._transportChart !== null) {
      this._transportChart = null;
    }

    if (this._timeSpendChart !== null) {
      this._timeSpendChart = null;
    }

    this._moneyChart = renderChart(
        this.getElement().querySelector(`.statistics__chart--${statisticsType.money.name}`),
        statisticsType.money.name.toUpperCase(),
        statisticsType.money.labelFormat,
        this._getMoneyChartData(),
    );
    this._transportChart = renderChart(
        this.getElement().querySelector(`.statistics__chart--${statisticsType.transport.name}`),
        statisticsType.transport.name.toUpperCase(),
        statisticsType.transport.labelFormat,
        this._getTransportChartData(),
    );
    this._timeSpendChart = renderChart(
        this.getElement().querySelector(`.statistics__chart--${statisticsType.time.name}`),
        statisticsType.time.name.toUpperCase(),
        statisticsType.time.labelFormat,
        this._getTimeSpendChartData(),
    );
  }

  _getMoneyChartData() {
    const data = this._data.reduce((acc, item) => {
      acc[item.type] = acc[item.type] ? acc[item.type] + item.cost : item.cost;
      return acc;
    }, {});

    return this._getFormattedData(data);
  }

  _getTransportChartData() {
    const data = this._data
      .filter((item) => EVENT_TRANSPORT.includes(item.type))
      .reduce((acc, item) => {
        acc[item.type] = acc[item.type] ? acc[item.type] + 1 : 1;
        return acc;
      }, {});

    return this._getFormattedData(data);
  }

  _getTimeSpendChartData() {
    const data = this._data.reduce((acc, item) => {
      const duration = item.endDate - item.startDate;
      acc[item.type] = acc[item.type] ? acc[item.type] + duration : duration;
      return acc;
    }, {});

    return this._getFormattedData(data);
  }

  _getFormattedData(data) {
    return Object.entries(data)
      .sort((a, b) => b[1] - a[1])
      .reduce((acc, [key, value]) => {
        const emoji = EVENT_EMOJI[key] ? EVENT_EMOJI[key] : ``;
        const label = `${emoji} ${key.toUpperCase()}`;
        acc[label] = value;

        return acc;
      }, {});
  }
}
