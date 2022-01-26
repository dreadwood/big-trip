import {capitalizeStr} from './utils/common';

export const SortingTypes = {
  EVENT: `sort-event`,
  TIME: `sort-time`,
  PRICE: `sort-price`,
};

export const UserAction = {
  UPDATE_EVENT: `UPDATE_EVENT`,
  ADD_EVENT: `ADD_EVENT`,
  DELETE_EVENT: `DELETE_EVENT`,
};

export const UpdateType = {
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`,
  INIT: `INIT`,
};

export const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`,
  FAVORITE: `favorite`,
};

export const MenuTabs = {
  TABLE: `Table`,
  STATS: `Stats`,
};

export const MessagePage = {
  NO_EVENT: `Click New Event to create your first point`,
  LOADING: `Loading…`,
};

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
