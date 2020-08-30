import AbstractView from "./abstract.js";

const STATISTICS_TYPE = [
  `money`,
  `transport`,
  `time`,
];

const createStatisticTemplate = () => {
  // Markup has element div with "statistics__item--time-spend" class
  return (
    `<section class="statistics">
      <h2 class="visually-hidden">Trip statistics</h2>
      ${STATISTICS_TYPE.map((item) => `<div class="statistics__item statistics__item--${item}">
        <canvas class="statistics__chart statistics__chart--${item}" width="900"></canvas>
      </div>`)}
    </section>`
  );
};

export default class StatisticView extends AbstractView {
  getTemplate() {
    return createStatisticTemplate();
  }
}
