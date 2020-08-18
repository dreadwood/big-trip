import {getRandomInteger, getRandomArrayItems} from '../utils.js';

const SentencesDescription = {
  MIN: 1,
  MAX: 5,
};

const PhotosDescription = {
  MIN: 1,
  MAX: 10
};

export const CITIES = [
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

export const generateDestination = (city) => {
  const description = new Array(getRandomInteger(SentencesDescription.MIN, SentencesDescription.MAX))
    .fill(``).map(() => getRandomArrayItems(PARTS_OF_DESCRIPTION)).join(` `);

  const photos = new Array(getRandomInteger(PhotosDescription.MIN, PhotosDescription.MAX))
    .fill(``).map(() => `http://picsum.photos/248/152?r=${Math.random()}`);

  return {
    city,
    description,
    photos,
  };
};

export const destinations = CITIES.map((city) => generateDestination(city));
