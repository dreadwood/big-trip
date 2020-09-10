import {EVENT_TYPES, EVENT_TRANSPORT, EVENT_ACTIVITY} from '../mock/trip-event.js';
import {TYPES_OF_OFFERS} from '../mock/offers.js';
import {CITIES, destinationsList} from '../mock/destinations.js';
import {capitalizeStr} from '../utils/common.js';
import {getTime, getDateWithSlash} from '../utils/date.js';
import SmartView from "./smart.js";

const getOffersByType = (offers, type) => {
  const list = offers.find((item) => item.type === type);
  return list.offers.length ? list.offers : null;
};

const BLANK_EVENT = {
  id: null,
  type: Object.keys(EVENT_TYPES)[1],
  startDate: new Date(),
  endDate: new Date(),
  cost: null,
  isFavorites: false,
  destination: null,
  offers: [],
};

const createEventTypeTemplate = (eventType, isChecked = false) => {
  return (
    `<div class="event__type-item">
      <input
        id="event-type-${eventType}"
        class="event__type-input  visually-hidden"
        type="radio"
        name="event-type"
        value="${eventType}"
        ${isChecked ? `checked` : ``}
      >
      <label
        class="event__type-label event__type-label--${eventType}"
        for="event-type-${eventType}"
      >${capitalizeStr(eventType)}</label>
    </div>`
  );
};

const createEventTypeListTemplate = (selectedType) => {
  return (
    `<div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle">
        <span class="visually-hidden">Choose event type</span>
        <img
          class="event__type-icon"
          width="17"
          height="17"
          src="img/icons/${selectedType}.png"
          alt="Event type icon"
        >
      </label>
      <input
        class="event__type-toggle visually-hidden"
        id="event-type-toggle"
        type="checkbox"
      >

      <div class="event__type-list">
        <fieldset class="event__type-group">
          <legend class="visually-hidden">Transfer</legend>
          ${EVENT_TRANSPORT
            .map((event) => createEventTypeTemplate(event, event === selectedType))
            .join(`\n`)}
        </fieldset>

        <fieldset class="event__type-group">
          <legend class="visually-hidden">Activity</legend>
          ${EVENT_ACTIVITY
            .map((event) => createEventTypeTemplate(event, event === selectedType))
            .join(`\n`)}
        </fieldset>
      </div>
    </div>`
  );
};

const createDestinationInputTemplate = (selectedType, city) => {
  return (
    `<div class="event__field-group event__field-group--destination">
      <label class="event__label event__type-output" for="event-destination">
        ${EVENT_TYPES[selectedType]}
      </label>
      <input
        class="event__input event__input--destination"
        id="event-destination"
        name="event-destination"
        value="${city}"
        list="destination-list"
      >
      <datalist id="destination-list">
        ${CITIES.map((cityItem) => `<option value="${cityItem}"></option>`).join(`\n`)}
      </datalist>
    </div>`
  );
};

const createDataInputTemplate = (startDate, endDate) => {
  return (
    `<div class="event__field-group event__field-group--time">
      <label class="visually-hidden" for="event-start-time">
        From
      </label>
      <input
        class="event__input  event__input--time"
        id="event-start-time"
        type="text"
        name="event-start-time"
        value="${getDateWithSlash(startDate)} ${getTime(startDate)}"
      >
      &mdash;
      <label class="visually-hidden" for="event-end-time">
        To
      </label>
      <input
        class="event__input  event__input--time"
        id="event-end-time"
        type="text"
        name="event-end-time"
        value="${getDateWithSlash(endDate)} ${getTime(endDate)}"
      >
    </div>`
  );
};

const createPriceInputTemplate = (cost) => {
  return (
    `<div class="event__field-group  event__field-group--price">
      <label class="event__label" for="event-price">
        <span class="visually-hidden">Price</span>
        &euro;
      </label>
      <input
        class="event__input  event__input--price"
        id="event-price"
        type="text"
        name="event-price"
        value="${cost ? cost : ``}"
      >
    </div>`
  );
};

const createButtonsTemplate = (id, isFavorites) => {
  return (
    `<button class="event__save-btn btn btn--blue" type="submit">Save</button>

    ${id ? `<button class="event__reset-btn" type="reset">Delete</button>`
      : `<button class="event__reset-btn" type="reset">Cancel</button>`}

    ${id ? `<input
      id="event-favorite"
      class="event__favorite-checkbox  visually-hidden"
      type="checkbox"
      name="event-favorite"
      ${isFavorites ? `checked` : ``}
    >

    <label class="event__favorite-btn" for="event-favorite">
      <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688
          14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </label>

    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Close event</span>
    </button>` : ``}`
  );
};

const createOfferTemplate = ({title, price}, isChecked) => {
  const name = title.toLowerCase().replace(/ /g, `-`);

  return (
    `<div class="event__offer-selector">
      <input
        class="event__offer-checkbox visually-hidden"
        id="event-offer-${name}"
        type="checkbox"
        name="${name}"
        ${isChecked ? `checked` : ``}
      >
      <label class="event__offer-label" for="event-offer-${name}">
        <span class="event__offer-title">${title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </label>
    </div>`
  );
};

const createOffersSectionTemplate = (eventOffers, selectedOffers) => {
  const selectedTypeOffers = selectedOffers
    ? selectedOffers.map((offer) => offer.title)
    : [];

  return (
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
        ${eventOffers
          .map((offer) => createOfferTemplate(offer, selectedTypeOffers.includes(offer.title)))
          .join(`\n`)}
      </div>
    </section>`
  );
};

const createDestinationSectionTemplate = ({description, photos}) => {
  return (
    `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${description}</p>

      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${photos
            .map((photo) => `<img class="event__photo" src="${photo.src}" alt="${photo.alt}">`)
            .join(`\n`)}
        </div>
      </div>
    </section>`
  );
};

const createEventEditTemplate = (data) => {
  const {
    id,
    type,
    startDate,
    endDate,
    cost,
    isFavorites,
    destination,
    offers,
    offersType
  } = data;

  const city = destination ? destination.city : ``;

  const eventDetailsTemplate = () => (offersType || destination)
    ? `<section class="event__details">
      ${offersType ? createOffersSectionTemplate(offersType, offers) : ``}
      ${destination ? createDestinationSectionTemplate(destination) : ``}
    </section>`
    : ``;

  return (
    `<form class="trip-events__item event event--edit" action="#" method="post">
      <header class="event__header">
        ${createEventTypeListTemplate(type)}
        ${createDestinationInputTemplate(type, city)}
        ${createDataInputTemplate(startDate, endDate)}
        ${createPriceInputTemplate(cost)}
        ${createButtonsTemplate(id, isFavorites)}
      </header>

      ${eventDetailsTemplate()}
    </form>`
  );
};

export default class EventEditView extends SmartView {
  constructor(event = BLANK_EVENT) {
    super();
    this._data = EventEditView.parseEventToData(event);

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._arrowButtonClickHandler = this._arrowButtonClickHandler.bind(this);
    this._favoritesClickHandler = this._favoritesClickHandler.bind(this);
    this._typeChangeHandler = this._typeChangeHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);
    this._destinationClickHandler = this._destinationClickHandler.bind(this);
    this._offerListClickHandler = this._offerListClickHandler.bind(this);

    this._setInnerHandlers();
  }

  reset(task) {
    this.updateData(
        EventEditView.parseEventToData(task)
    );
  }

  getTemplate() {
    return createEventEditTemplate(this._data);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setArrowButtonClickHandler(this._callback.arrowButtonClick);
    this.setFavoritesClickHandler(this._callback.favoritesClick);
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector(`.event__type-list`)
      .addEventListener(`click`, this._typeChangeHandler);
    this.getElement()
      .querySelector(`.event__input--destination`)
      .addEventListener(`change`, this._destinationChangeHandler);
    this.getElement()
      .querySelector(`.event__input--destination`)
      .addEventListener(`click`, this._destinationClickHandler);

    if (this._data.offersType) {
      this.getElement()
        .querySelector(`.event__available-offers`)
        .addEventListener(`click`, this._offerListClickHandler);
    }
  }

  _typeChangeHandler(evt) {
    if (evt.target.tagName === `INPUT`) {
      evt.preventDefault();

      this.updateData({
        type: evt.target.value,
        offers: [],
        offersType: getOffersByType(TYPES_OF_OFFERS, evt.target.value),
      });
    }
  }

  _destinationClickHandler(evt) {
    evt.preventDefault();

    evt.target.value = ``;
  }

  _destinationChangeHandler(evt) {
    evt.preventDefault();

    this.updateData({
      destination: destinationsList.find((item) => item.city === evt.target.value),
    });
  }

  _offerListClickHandler(evt) {
    if (evt.target.tagName === `INPUT`) {
      const offerTitle = capitalizeStr(evt.target.name.replace(/-/g, ` `));
      const selectedOffers = this._data.offers.slice();
      const index = selectedOffers.findIndex((offer) => offer.title === offerTitle);

      if (index === -1) {
        selectedOffers.push(this._data.offersType
          .find((offerType) => offerType.title === offerTitle));
      } else {
        selectedOffers.splice(index, 1);
      }

      this.updateData({
        offers: selectedOffers,
      }, true);
    }
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(EventEditView.parseDataToEvent(this._data));
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().addEventListener(`submit`, this._formSubmitHandler);
  }

  _arrowButtonClickHandler(evt) {
    evt.preventDefault();
    this._callback.arrowButtonClick();
  }

  setArrowButtonClickHandler(callback) {
    this._callback.arrowButtonClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, this._arrowButtonClickHandler);
  }

  _favoritesClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoritesClick(EventEditView.parseDataToEvent(this._data));
  }

  setFavoritesClickHandler(callback) {
    this._callback.favoritesClick = callback;
    this.getElement().querySelector(`.event__favorite-btn`)
      .addEventListener(`click`, this._favoritesClickHandler);
  }

  static parseEventToData(event) {
    return Object.assign(
        {},
        event,
        {
          offersType: getOffersByType(TYPES_OF_OFFERS, event.type),
        }
    );
  }

  static parseDataToEvent(data) {
    data = Object.assign({}, data);

    delete data.offersType;

    return data;
  }
}
