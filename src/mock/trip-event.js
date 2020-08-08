import {getRandomInteger, getRandomArrayItems} from '../utils.js';

const MAX_PRICE = 1000;
const MAX_TIME_EVENT = 180;

const PhotosDescription = {
  MIN: 1,
  MAX: 10
};

const SentencesDescription = {
  MIN: 1,
  MAX: 5,
};

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

const PARTS_OF_DESCRIPTION = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`,
];

const CITIES = [
  `Amsterdam`,
  `Chamonix`,
  `Geneva`,
  `Rotterdam`,
  `Antwerpen`,
  `Bruxelles`,
  `Luxembourg`,
  `Strasbourg`,
  `Bern`,
];

const TypesOffers = {
  'flight': [
    {
      type: `luggage`,
      offer: `Add luggage`,
      price: 30,
    },
    {
      type: `comfort`,
      offer: `Switch to comfort class`,
      price: 100,
    },
    {
      type: `meal`,
      offer: `Add meal`,
      price: 15,
    },
    {
      type: `seats`,
      offer: `Choose seats`,
      price: 5,
    },
    {
      type: `train`,
      offer: `Travel by train`,
      price: 40,
    },
  ],
  'check-in': [
    {
      type: `breakfast`,
      offer: `Add breakfast`,
      price: 50,
    },
    {
      type: `ironing`,
      offer: `Ironing service`,
      price: 15,
    },
    {
      type: `spa`,
      offer: `Spa`,
      price: 80,
    },
  ],
  'taxi': [
    {
      type: `uber`,
      offer: `Order Uber`,
      price: 20,
    },
  ],
  'drive': [
    {
      type: `rent`,
      offer: `Rent a car`,
      price: 200,
    },
  ],
  'sightseeing': [
    {
      type: `tickets`,
      offer: `Book tickets`,
      price: 40,
    },
    {
      type: `lunch`,
      offer: `Lunch in city`,
      price: 30,
    },
  ],
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

  const currentDate = new Date(2020, 7, 15, 10, 0, 0, 0);

  currentDate.setDate(currentDate.getDate() + daysGap);
  currentDate.setHours(currentDate.getHours() + hoursGap);
  currentDate.setMinutes(currentDate.getMinutes() + minutesGap);

  return new Date(currentDate);
};

const getRandomOffers = (typeEvent) => {
  if (!TypesOffers.hasOwnProperty(typeEvent)) {
    return null;
  }

  const eventOffers = TypesOffers[typeEvent];
  const offersCount = eventOffers.length;

  const offers = new Array(getRandomInteger(1, offersCount))
    .fill(``).map(() => getRandomArrayItems(eventOffers));

  return offers;
};

export const generateTripEvent = () => {
  const id = String(new Date().getTime() + Math.random());

  const typeEvent = getRandomArrayItems(Object.keys(EVENT_TYPES));
  const city = getRandomArrayItems(CITIES);
  const cost = getRoundedValue(MAX_PRICE);

  const startDate = generateDate();
  const endDate = new Date(startDate.getTime() + getRoundedValue(MAX_TIME_EVENT) * 60 * 1000);

  const offers = getRandomInteger() ? getRandomOffers(typeEvent) : null;

  const photos = new Array(getRandomInteger(PhotosDescription.MIN, PhotosDescription.MAX))
    .fill(``).map(() => `http://picsum.photos/248/152?r=${Math.random()}`);

  const description = new Array(getRandomInteger(SentencesDescription.MIN, SentencesDescription.MAX))
    .fill(``).map(() => getRandomArrayItems(PARTS_OF_DESCRIPTION)).join(` `);

  return {
    id,
    typeEvent,
    offers,
    city,
    startDate,
    endDate,
    cost,
    description,
    photos,
  };
};
