import {FilterType} from '../const.js';
import {isFutureTask, isPastTask} from './date.js';

export const filter = {
  [FilterType.EVERYTHING]: (events) => events.slice(),
  [FilterType.FUTURE]: (events) => events.filter((event) => isFutureTask(event.startDate)),
  [FilterType.PAST]: (events) => events.filter((event) => isPastTask(event.endDate)),
};
