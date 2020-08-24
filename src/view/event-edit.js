import {EVENT_TYPES, EVENT_TRANSPORT, EVENT_ACTIVITY} from '../mock/trip-event.js';
import {TYPES_OF_OFFERS} from '../mock/offers.js';
import {CITIES} from '../mock/destinations.js';
import {getTime, getDateWithSlash, capitalizeStr} from '../utils.js';

const BLANK_EVENT = {
  id: null,
  type: Object.keys(EVENT_TYPES)[1],
  startDate: new Date(),
  endDate: new Date(),
  cost: null,
  isFavorites: false,
  destination: null,
  offers: null,
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
        type="text"
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

const createOfferTemplate = ({type, description, price}, isChecked) => {
  return (
    `<div class="event__offer-selector">
      <input
        class="event__offer-checkbox visually-hidden"
        id="event-offer-${type}"
        type="checkbox"
        name="event-offer-${type}"
        ${isChecked ? `checked` : ``}
      >
      <label class="event__offer-label" for="event-offer-${type}">
        <span class="event__offer-title">${description}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </label>
    </div>`
  );
};

const createOffersSectionTemplate = (eventOffers, selectedOffers) => {
  const selectedTypeOffers = selectedOffers
    ? [...selectedOffers].map((offer) => offer.type)
    : [];

  return (
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
        ${eventOffers
          .map((offer) => createOfferTemplate(offer, selectedTypeOffers.includes(offer.type)))
          .join(`\n`)}
      </div>
    </section>`
  );
};

const createDestinationSectionTemplate = ({photos, description}) => {
  return (
    `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${description}</p>

      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${photos.map((src) => `<img class="event__photo" src="${src}" alt="Event photo">`).join(`\n`)}
        </div>
      </div>
    </section>`
  );
};

export const createEventEditTemplate = (event = BLANK_EVENT) => {
  const {
    id,
    type,
    startDate,
    endDate,
    cost,
    isFavorites,
    destination,
    selectedOffers,
  } = event;

  const city = destination ? destination.city : ``;

  const eventOffers = TYPES_OF_OFFERS.find((item) => item.type === type).offers;
  const offersCount = eventOffers.length;

  const eventDetailsTemplate = () => (offersCount || destination)
    ? `<section class="event__details">
      ${offersCount ? createOffersSectionTemplate(eventOffers, selectedOffers) : ``}
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
