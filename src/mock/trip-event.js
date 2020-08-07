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

const EVENT_TYPES = [
  `taxi`,
  `bus`,
  `train`,
  `ship`,
  `transport`,
  `drive`,
  `Flight`,
  `Check-in`,
  `sightseeing`,
  `restaurant`,
];

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

const OffersType = {
  'flight': [
    {
      offer: `Add luggage`,
      price: 30,
    },
    {
      offer: `Switch to comfort class`,
      price: 100,
    },
    {
      offer: `Add meal`,
      price: 15,
    },
    {
      offer: `Choose seats`,
      price: 5,
    },
    {
      offer: `Travel by train`,
      price: 40,
    },
  ],
  'check-in': [
    {
      offer: `Airport drop-off`,
      price: 25,
    },
    {
      offer: `Airport pickup`,
      price: 25,
    },
    {
      offer: `Ironing service`,
      price: 15,
    },
    {
      offer: `Swimming pool`,
      price: 10,
    },
    {
      offer: `Spa`,
      price: 20,
    },
  ],
};


const getRandomMinutes = (maxMinutes) => {
  const rounding = 5;
  const minutes = getRandomInteger(maxMinutes);
  const remainder = minutes % rounding;

  return minutes - remainder;
};

const generateDate = () => {
  const maxDaysGap = 5;
  const maxHoursGap = 10;
  const maxMinutesGap = 59;
  const daysGap = getRandomInteger(maxDaysGap);
  const hoursGap = getRandomInteger(maxHoursGap);
  const minutesGap = getRandomMinutes(maxMinutesGap);

  const currentDate = new Date(2020, 7, 15, 10, 0, 0, 0);

  currentDate.setDate(currentDate.getDate() + daysGap);
  currentDate.setHours(currentDate.getHours() + hoursGap);
  currentDate.setMinutes(currentDate.getMinutes() + minutesGap);

  return new Date(currentDate);
};

export const generateTripEvents = () => {
  const id = String(new Date().getTime() + Math.random());

  const type = getRandomArrayItems(EVENT_TYPES);
  const city = getRandomArrayItems(CITIES);
  const cost = getRandomInteger(MAX_PRICE);

  const startDate = generateDate();
  const endDate = new Date(startDate.getTime() + getRandomMinutes(MAX_TIME_EVENT) * 60 * 1000);

  const offers = type.toLowerCase() in OffersType ? OffersType[type.toLowerCase()] : null;

  const photos = new Array(getRandomInteger(PhotosDescription.MIN, PhotosDescription.MAX))
    .fill(``).map(() => `http://picsum.photos/248/152?r=${Math.random()}`);

  const description = new Array(getRandomInteger(SentencesDescription.MIN, SentencesDescription.MAX))
    .fill(``).map(() => getRandomArrayItems(PARTS_OF_DESCRIPTION)).join(` `);

  return {
    id,
    type,
    offers,
    city,
    startDate,
    endDate,
    cost,
    destination: {
      description,
      photos,
    },
  };
};
