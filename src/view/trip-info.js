import {getShortDate} from '../utils/common.js';
import {createElement} from '../utils/render.js';

const createRouteTemplate = (events, cityQuantity) => {
  const firstCity = events[0].destination.city;
  const lastCity = events[cityQuantity - 1].destination.city;

  switch (cityQuantity) {
    case 1:
      return `<h1 class="trip-info__title">
        ${firstCity}
      </h1>`;
    case 2:
      return `<h1 class="trip-info__title">
        ${firstCity} &mdash; ${lastCity}
      </h1>`;
    case 3:
      return `<h1 class="trip-info__title">
        ${firstCity} &mdash; ${events[1].destination.city} &mdash; ${lastCity}
      </h1>`;
    default:
      return `<h1 class="trip-info__title">
        ${firstCity} &mdash; ... &mdash; ${lastCity}
      </h1>`;
  }
};

const createDatesTemplate = (events) => {
  const startDate = getShortDate(events[0].startDate);
  const endDate = getShortDate(events[events.length - 1].endDate);

  return (
    `<p class="trip-info__dates">${startDate}&nbsp;&mdash;&nbsp;${endDate}</p>`
  );
};

const createTripInfoTemplate = (events) => {
  const cityQuantity = events.length;

  const routeTemplate = cityQuantity ? createRouteTemplate(events, cityQuantity) : ``;
  const datesTemplate = cityQuantity ? createDatesTemplate(events) : ``;
  const fullCost = cityQuantity ? events.reduce((acc, event) => (acc + event.cost), 0) : 0;

  return (
    `<section class="trip-main__trip-info trip-info">
      <div class="trip-info__main">
        ${routeTemplate}
        ${datesTemplate}
      </div>

      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${fullCost}</span>
      </p>
    </section>`
  );
};

export default class TripInfoView {
  constructor(events = []) {
    this._element = null;
    this._events = events;
  }

  getTemplate() {
    return createTripInfoTemplate(this._events);
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
