import {getRandomInteger, getRandomArrayItems} from '../utils/common.js';
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
  `flight`
];

export const EVENT_ACTIVITY = [
  `check-in`,
  `sightseeing`,
  `restaurant`
];

export const EVENT_TYPES = {
  'taxi': `Taxi to`,
  'bus': `Bus to`,
  'train': `Train to`,
  'ship': `Ship to`,
  'transport': `Transport to`,
  'drive': `Drive to`,
  'flight': `Flight to`,
  'check-in': `Check-in in`,
  'sightseeing': `Sightseeing in`,
  'restaurant': `Restaurant in`,
};

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

  const currentDate = new Date(2020, 8, 27, 10, 0, 0, 0);

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

export const generateTripEvent = () => {
  const id = String(new Date().getTime() + Math.random());

  const type = getRandomArrayItems(Object.keys(EVENT_TYPES));
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
