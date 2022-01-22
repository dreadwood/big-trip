import {eventWithSyntax} from '../mock/event.js';
import {getTime, getFormatDuration, getFullDatetime} from '../utils/date.js';
import AbstractView from "./abstract.js";

const MAX_VISIBLE_OFFERS = 3;

const createOffersTemplate = (offers) => {
  return (
    `<ul class="event__selected-offers">
      ${offers.map(({title, price}, i) => i < MAX_VISIBLE_OFFERS
      ? `<li class="event__offer">
          <span class="event__offer-title">${title}</span> &plus;
          &euro;&nbsp;<span class="event__offer-price">${price}</span>
        </li>`
      : ``).join(`\n`)}
    </ul>`
  );
};

const createFavoriteTemplate = (id, isFavorites) => {
  return (
    `<input
      id="event-favorite-${id}"
      class="event__favorite-checkbox  visually-hidden"
      type="checkbox"
      name="event-favorite"
      ${isFavorites ? `checked` : ``}
    >

    <label class="event__favorite-btn" for="event-favorite-${id}">
      <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688
          14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </label>`
  );
};

const createEventTemplate = (event) => {
  const {
    id,
    type,
    offers,
    startDate,
    endDate,
    cost,
    isFavorites,
    destination,
  } = event;

  const city = destination.city;
  const startTime = getTime(startDate);
  const endTime = getTime(endDate);
  const startDatetime = getFullDatetime(startDate);
  const endDatetime = getFullDatetime(endDate);
  const duration = getFormatDuration(endDate - startDate);

  const offersTemplate = offers ? createOffersTemplate(offers) : ``;
  const favoriteTemplate = createFavoriteTemplate(id, isFavorites);

  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${eventWithSyntax[type]} ${city}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${startDatetime}">${startTime}</time>
            &mdash;
            <time class="event__end-time" datetime="${endDatetime}">${endTime}</time>
          </p>
          <p class="event__duration">${duration}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${cost}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>

        ${offersTemplate}
        ${favoriteTemplate}

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
    this._favoritesClickHandler = this._favoritesClickHandler.bind(this);
  }

  getTemplate() {
    return createEventTemplate(this._event);
  }

  setArrowButtonClickHandler(callback) {
    this._callback.arrowButtonClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._arrowButtonClickHandler);
  }

  setFavoritesClickHandler(callback) {
    this._callback.favoritesClick = callback;
    this.getElement().querySelector(`.event__favorite-btn`).addEventListener(`click`, this._favoritesClickHandler);
  }

  _arrowButtonClickHandler(evt) {
    evt.preventDefault();
    this._callback.arrowButtonClick();
  }

  _favoritesClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoritesClick(this._event);
  }
}
