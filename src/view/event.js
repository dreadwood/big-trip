import {EVENT_TYPES} from '../mock/trip-event.js';
import {getTime, getDateWithDash, getFormatDuration} from '../utils/date.js';
import AbstractView from "./abstract.js";

const createOffersTemplate = (offers) => {
  return (
    `<ul class="event__selected-offers">
      ${[...offers].map(({description, price}) => `<li class="event__offer">
        <span class="event__offer-title">${description}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${price}</span>
      </li>`).join(`\n`)}
    </ul>`
  );
};

const createEventTemplate = (event) => {
  const {
    type,
    offers,
    startDate,
    endDate,
    cost,
    destination,
  } = event;

  const city = destination.city;
  const startTime = getTime(startDate);
  const endTime = getTime(endDate);
  const startFormatDate = getDateWithDash(startDate);
  const endFormatDate = getDateWithDash(endDate);
  const duration = getFormatDuration(endDate - startDate);

  const offersTemplate = offers ? createOffersTemplate(offers) : ``;

  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${EVENT_TYPES[type]} ${city}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${startFormatDate}T${startTime}">${startTime}</time>
            &mdash;
            <time class="event__end-time" datetime="${endFormatDate}T${endTime}">${endTime}</time>
          </p>
          <p class="event__duration">${duration}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${cost}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>

        ${offersTemplate}

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};

export default class EventView extends AbstractView {
  constructor(event) {
    super();

    this._event = event;
    this._arrowButtonClickHandler = this._arrowButtonClickHandler.bind(this);
  }

  getTemplate() {
    return createEventTemplate(this._event);
  }

  _arrowButtonClickHandler(evt) {
    evt.preventDefault();
    this._callback.arrowButtonClick();
  }

  setArrowButtonClickHandler(callback) {
    this._callback.arrowButtonClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._arrowButtonClickHandler);
  }
}
