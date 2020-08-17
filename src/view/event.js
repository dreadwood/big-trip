import {EVENT_TYPES} from '../mock/trip-event.js';

const addNumberWithZero = (number) => { // 6 => 06
  return (number < 10) ? `0${number}` : `${number}`;
};

const getTime = (date) => { // 19:26
  const minutes = date.getUTCMinutes();

  return `${date.getHours()}:${addNumberWithZero(minutes)}`;
};

const getFormatDate = (date) => { // 2020-08-16
  const mounth = date.getMonth() + 1;
  const day = date.getDate();

  return `${date.getFullYear()}-${addNumberWithZero(mounth)}-${addNumberWithZero(day)}`;
};

const getDuration = (durationInMs) => { // 1H 25M
  const durationInMin = durationInMs / (60 * 1000);

  return (durationInMin > 60)
    ? `${Math.floor(durationInMin / 60)}H ${durationInMin % 60}M`
    : `${durationInMin}M`;
};

const createOffersTemplate = (offers) => {
  return (
    `<ul class="event__selected-offers">
      ${offers.map(({description, price}) => `<li class="event__offer">
        <span class="event__offer-title">${description}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${price}</span>
      </li>`).join(`\n`)}
    </ul>`
  );
};

export const createEventTemplate = (event) => {
  const {
    type,
    offers,
    city,
    startDate,
    endDate,
    cost,
  } = event;

  const startTime = getTime(startDate);
  const endTime = getTime(endDate);
  const startFormatDate = getFormatDate(startDate);
  const endFormatDate = getFormatDate(endDate);
  const duration = getDuration(endDate - startDate);

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
