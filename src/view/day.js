import {getDatetime, getShortDateInversion} from '../utils/date.js';
import AbstractView from "./abstract.js";

const createDayInfoTemplate = (date, i) => {
  const dateElement = new Date(date);

  const datetime = getDatetime(dateElement);
  const formatDate = getShortDateInversion(date);

  return (
    `<span class="day__counter">${i + 1}</span>
    <time
      class="day__date"
      datetime="${datetime}"
    >${formatDate}</time>`
  );
};

const createDayTemplate = (date, i) => {
  return (
    `<li class="trip-days__item day">
      <div class="day__info">
        ${date ? createDayInfoTemplate(date, i) : ``}
      </div>
      <ul class="trip-events__list"></ul>
    </li>`
  );
};

export default class DayView extends AbstractView {
  constructor(date, index) {
    super();

    this._date = date;
    this._index = index;
  }

  getTemplate() {
    return createDayTemplate(this._date, this._index);
  }
}
