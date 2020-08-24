import TripInfoView from './view/trip-info.js';
import MenuView from './view/menu.js';
import FiltersView from './view/filters.js';
import SortingView from './view/sorting.js';
import DayListView from './view/day-list.js';
import DayView from './view/day.js';
import {createEventTemplate} from './view/event.js';
import {createEventEditTemplate} from './view/event-edit.js';
// import PageMessageView from './view/page-message.js';
// import StatisticView from './view/statistic.js';
import {generateTripEvent} from './mock/trip-event.js';
import {RenderPosition, renderTemplate, renderElement} from './utils/render.js';

const EVENT_COUNT = 20;

const events = new Array(EVENT_COUNT).fill(``)
  .map(generateTripEvent)
  .sort((a, b) => a.startDate - b.startDate);

const datesEvents = [...new Set(events
  .map((event) => event.startDate.toDateString()))];

const bodyElement = document.querySelector(`.page-body`);
const headerMainElement = bodyElement.querySelector(`.trip-main`);
const headerControlsElement = headerMainElement.querySelector(`.trip-controls`);
const pageContainerElement = bodyElement.querySelector(`.trip-events`);

renderElement(headerMainElement, new TripInfoView(events).getElement(events), RenderPosition.AFTER_BEGIN);
renderElement(headerControlsElement, new MenuView().getElement(), RenderPosition.AFTER_BEGIN);
renderElement(headerControlsElement, new FiltersView().getElement());

renderElement(pageContainerElement, new SortingView().getElement());
renderTemplate(pageContainerElement, createEventEditTemplate(events[0]));
renderElement(pageContainerElement, new DayListView().getElement());

const dayListElement = pageContainerElement.querySelector(`.trip-days`);

datesEvents.forEach((date, i) => {
  renderElement(dayListElement, new DayView(date, i).getElement());
  const eventListElement = dayListElement.querySelector(`.trip-events__list-${i}`);

  events
    .filter((event) => event.startDate.toDateString() === date)
    .forEach((event) => renderTemplate(eventListElement, createEventTemplate(event)));
});
