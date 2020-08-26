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

export const getDateWithSlash = (date) => { // 16/08/20
  const day = addNumberWithZero(date.getDate());
  const mounth = addNumberWithZero(date.getMonth() + 1);
  const year = String(date.getFullYear()).slice(2);

  return `${day}/${mounth}/${year}`;
};

export const getShortDate = (date) => { // 19 AUG
  return date
    .toLocaleString(`en-GB`, {day: `numeric`, month: `short`})
    .toUpperCase();
};
