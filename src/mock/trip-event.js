import {getRandomInteger, getRandomArrayItems, capitalizeStr} from '../utils/common.js';
import {TYPES_OF_OFFERS} from './offers.js';
import {CITIES, destinationsList} from './destinations.js';

const MAX_PRICE = 1000;
const MAX_TIME_EVENT = 180;

export const EVENT_TRANSPORT = [
  `taxi`,
  `bus`,
  `train`,
  `ship`,
  `transport`,
  `drive`,
  `flight`,
];

export const EVENT_ACTIVITY = [
  `check-in`,
  `sightseeing`,
  `restaurant`,
];

export const EVENT_EMOJI = {
  'taxi': `🚕`,
  'bus': `🚌`,
  'train': `🚂`,
  'ship': `🚢`,
  'transport': `🚆`,
  'drive': `🚗`,
  'flight': `✈️`,
  'check-in': `🏨`,
  'sightseeing': `🏛`,
  'restaurant': `🍴`,
};

export const allTypesOfEvents = [...EVENT_TRANSPORT, ...EVENT_ACTIVITY];

export const eventWithSyntax = {
  ...EVENT_TRANSPORT.reduce((acc, item) => {
    acc[item] = `${capitalizeStr(item)} to`;
    return acc;
  }, {}),
  ...EVENT_ACTIVITY.reduce((acc, item) => {
    acc[item] = `${capitalizeStr(item)} in`;
    return acc;
  }, {})};

const getRoundedValue = (maxValue) => {
  const rounding = 5;
  const value = getRandomInteger(maxValue);
  const remainder = value % rounding;

  return value - remainder;
};

const generateDate = () => {
  const maxDaysGap = 5;
  const maxHoursGap = 10;
  const maxMinutesGap = 59;
  const daysGap = getRandomInteger(maxDaysGap);
  const hoursGap = getRandomInteger(maxHoursGap);
  const minutesGap = getRoundedValue(maxMinutesGap);

  const currentDate = new Date(2022, 0, 19, 10, 0, 0, 0);

  currentDate.setDate(currentDate.getDate() + daysGap);
  currentDate.setHours(currentDate.getHours() + hoursGap);
  currentDate.setMinutes(currentDate.getMinutes() + minutesGap);

  return new Date(currentDate);
};

const getRandomOffers = (typeEvent) => {
  const eventOffers = TYPES_OF_OFFERS.find((item) => item.type === typeEvent).offers;
  const offersCount = eventOffers.length;

  if (offersCount === 0) {
    return [];
  }

  const offers = new Set();
  for (let i = 0; i < offersCount; i++) {
    offers.add(getRandomArrayItems(eventOffers));
  }

  return Array.from(offers);
};

export const generateId = () => Date.now() + parseInt(Math.random() * 10000, 10);

export const generateTripEvent = () => {
  const id = generateId();

  const type = getRandomArrayItems(allTypesOfEvents);
  const cost = getRoundedValue(MAX_PRICE);

  const startDate = generateDate();
  const endDate = new Date(startDate.getTime() + getRoundedValue(MAX_TIME_EVENT) * 60 * 1000);

  const isFavorites = getRandomInteger() ? true : false;
  const offers = getRandomInteger() ? getRandomOffers(type) : [];

  const city = getRandomArrayItems(CITIES);
  const destination = destinationsList.find((item) => item.city === city);

  return {
    id,
    type,
    offers,
    startDate,
    endDate,
    cost,
    isFavorites,
    destination,
  };
};
