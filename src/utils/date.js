import moment from 'moment';

export const getTime = (date) => { // 19:26
  return moment(date).format(`HH:mm`);
};

export const getDatetime = (date) => { // 2020-08-19
  return moment(date).format(`YYYY-MM-DD`);
};

export const getFullDatetime = (date) => { // 2020-08-19T12:08
  return moment(date).format(`YYYY-MM-DD[T]HH:mm`);
};

export const getFullDateWithSlash = (date) => { // 19/08/20 12:08
  return moment(date).format(`DD/MM/YY HH:mm`);
};

export const getShortDate = (date) => { // 19 AUG
  return moment(date).format(`DD MMM`);
};

export const getShortDateInversion = (date) => { // AUG 19
  return moment(date).format(`MMM DD`);
};

export const getFormatDuration = (durationInMs) => { // 1D 1H 25M
  const minutes = moment.duration(durationInMs, `ms`).minutes();
  const hours = moment.duration(durationInMs, `ms`).hours();
  const days = Math.floor(moment.duration(durationInMs, `ms`).asDays());

  const d = days ? `${days}D` : ``;
  const h = hours ? `${hours}H` : ``;
  const m = minutes ? `${minutes}M` : ``;

  return `${d} ${h} ${m}`;
};

export const getDurationEvent = (event) => event.endDate - event.startDate; // ms (number)

export const isDatesEqual = (dateA, dateB) => {
  return moment(dateA).isSame(dateB);
};

export const isFutureTask = (startDate) => {
  const currentDate = new Date();

  return moment(currentDate).isBefore(startDate, `day`);
};

export const isPastTask = (endDate) => {
  const currentDate = new Date();

  return moment(currentDate).isAfter(endDate, `day`);
};
