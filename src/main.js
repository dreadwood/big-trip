import {createTripInfoTemplate} from './view/trip-info.js';
import {createMenuTemplate} from './view/menu.js';
import {createFiltersTemplate} from './view/filters.js';
import {createSortingTemplate} from './view/sorting.js';
import {createDayListTemplate} from './view/day-list.js';
import {createDayTemplate} from './view/day.js';
import {createEventTemplate} from './view/event.js';
import {createEventEditTemplate} from './view/event-edit.js';
// import {createPageMessageTemplate} from './view/page-message.js';
// import {createStatisticTemplate} from './view/statistic.js';
import {generateTripEvent} from './mock/trip-event.js';

const EVENT_COUNT = 20;

const RenderPosition = {
  AFTER_BEGIN: `afterbegin`,
  BEFOR_END: `beforeend`,
};

const render = (container, template, place = RenderPosition.BEFOR_END) => {
  container.insertAdjacentHTML(place, template);
};

const events = new Array(EVENT_COUNT).fill(``)
  .map(generateTripEvent)
  .sort((a, b) => a.startDate - b.startDate);

const datesEvents = [...new Set(events
  .map((event) => event.startDate.toDateString()))];

const bodyElement = document.querySelector(`.page-body`);
const headerMainElement = bodyElement.querySelector(`.trip-main`);
const headerControlsElement = headerMainElement.querySelector(`.trip-controls`);
const pageContainerElement = bodyElement.querySelector(`.trip-events`);

render(headerMainElement, createTripInfoTemplate(events), RenderPosition.AFTER_BEGIN);
render(headerControlsElement, createMenuTemplate(), RenderPosition.AFTER_BEGIN);
render(headerControlsElement, createFiltersTemplate());

render(pageContainerElement, createSortingTemplate());
render(pageContainerElement, createEventEditTemplate(events[0]));
render(pageContainerElement, createDayListTemplate());

const dayListElement = pageContainerElement.querySelector(`.trip-days`);

datesEvents.forEach((date, i) => {
  render(dayListElement, createDayTemplate(date, i));
  const eventListElement = dayListElement.querySelector(`.trip-events__list-${i}`);

  events
    .filter((event) => event.startDate.toDateString() === date)
    .forEach((event) => render(eventListElement, createEventTemplate(event)));
});
