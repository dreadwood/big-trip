// Функция генерации случайного целого числа из диапазона
// Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
export const getRandomInteger = (a = 1, b = 0) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomArrayItems = (array) => {
  const randomIndex = getRandomInteger(array.length - 1);

  return array[randomIndex];
};

const addNumberWithZero = (number) => String(number).padStart(2, `0`);

export const getTime = (date) => { // 19:26
  const minutes = date.getUTCMinutes();

  return `${date.getHours()}:${addNumberWithZero(minutes)}`;
};

export const getDateWithDash = (date) => { // 2020-08-16
  const mounth = date.getMonth() + 1;
  const day = date.getDate();

  return `${date.getFullYear()}-${addNumberWithZero(mounth)}-${addNumberWithZero(day)}`;
};

export const getDateWithSlash = (date) => { // 16/08/2020
  const day = addNumberWithZero(date.getDate());
  const mounth = addNumberWithZero(date.getMonth() + 1);
  const year = String(date.getFullYear()).slice(2);

  return `${day}/${mounth}/${year}`;
};

export const capitalizeStr = (str) => (!str) ? str : str[0].toUpperCase() + str.slice(1);
