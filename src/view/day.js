import {getDateWithDash} from '../utils/common.js';
import {createElement} from '../utils/render.js';

const createDayTemplate = (date, i) => {
  const dateElement = new Date(date);

  const datetime = getDateWithDash(dateElement);
  const formatDate = date.toUpperCase().slice(4, 10);

  return (
    `<li class="trip-days__item day">
      <div class="day__info">
        <span class="day__counter">${i + 1}</span>
        <time
          class="day__date"
          datetime="${datetime}"
        >${formatDate}</time>
      </div>

      <ul class="trip-events__list"></ul>
    </li>`
  );
};

export default class DayView {
  constructor(date, index) {
    this._element = null;
    this._date = date;
    this._index = index;
  }

  getTemplate() {
    return createDayTemplate(this._date, this._index);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
