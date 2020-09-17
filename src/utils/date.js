import moment from 'moment';

export const getTime = (date) => { // 19:26
  return moment(date).format(`HH:MM`);
};

export const getDatetime = (date) => { // 2020-08-19
  return moment(date).format(`YYYY-MM-DD`);
};

export const getFullDatetime = (date) => { // 2020-08-19T12:08
  return moment(date).format(`YYYY-MM-DD[T]HH:MM`);
};

export const getFullDateWithSlash = (date) => { // 19/08/20 12:08
  return moment(date).format(`DD/MM/YY HH:MM`);
};

export const getShortDate = (date) => { // 19 AUG
  return moment(date).format(`DD MMM`);
};

export const getShortDateInversion = (date) => { // AUG 19
  return moment(date).format(`MMM DD`);
};

export const getFormatDuration = (durationInMs) => { // 1H 25M
  const durationInMin = durationInMs / (60 * 1000);

  return (durationInMin > 60)
    ? `${Math.floor(durationInMin / 60)}H ${durationInMin % 60}M`
    : `${durationInMin}M`;
};

export const getDurationEvent = (event) => event.endDate - event.startDate; // ms (number)
