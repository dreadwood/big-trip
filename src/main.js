import TripInfoView from './view/trip-info.js';
import MenuView from './view/menu.js';
import FiltersView from './view/filters.js';
import SortingView from './view/sorting.js';
import DayListView from './view/day-list.js';
import DayView from './view/day.js';
import EventView from './view/event.js';
import EventEditView from './view/event-edit.js';
import PageMessageView from './view/page-message.js';
// import StatisticView from './view/statistic.js';
import {generateTripEvent} from './mock/trip-event.js';
import {RenderPosition, render} from './utils/render.js';

const EVENT_COUNT = 20;

const events = new Array(EVENT_COUNT).fill(``)
  .map(generateTripEvent)
  .sort((a, b) => a.startDate - b.startDate);

const datesEvents = [...new Set(events
  .map((event) => event.startDate.toDateString()))];

const renderEvent = (container, event) => {
  const eventComponent = new EventView(event);
  const eventEditComponent = new EventEditView(event);

  const replaceCardToForm = () => {
    container.replaceChild(eventEditComponent.getElement(), eventComponent.getElement());
  };

  const replaceFormToCard = () => {
    container.replaceChild(eventComponent.getElement(), eventEditComponent.getElement());
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      replaceFormToCard();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  eventComponent.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
    replaceCardToForm();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  eventEditComponent.getElement().addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    replaceFormToCard();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  eventEditComponent.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, (evt) => {
    evt.preventDefault();
    replaceFormToCard();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(container, eventComponent.getElement());
};

const bodyElement = document.querySelector(`.page-body`);
const headerMainElement = bodyElement.querySelector(`.trip-main`);
const headerControlsElement = headerMainElement.querySelector(`.trip-controls`);
const pageContainerElement = bodyElement.querySelector(`.trip-events`);

render(headerMainElement, new TripInfoView(events).getElement(events), RenderPosition.AFTER_BEGIN);
render(headerControlsElement, new MenuView().getElement(), RenderPosition.AFTER_BEGIN);
render(headerControlsElement, new FiltersView().getElement());

if (events.length === 0) {
  render(pageContainerElement, new PageMessageView().getElement());
} else {
  render(pageContainerElement, new SortingView().getElement());
  const dayListComponent = new DayListView();
  render(pageContainerElement, dayListComponent.getElement());

  datesEvents.forEach((date, i) => {
    const dayComponent = new DayView(date, i);
    const eventListElement = dayComponent.getElement().querySelector(`.trip-events__list`);

    events
      .filter((event) => event.startDate.toDateString() === date)
      .forEach((event) => renderEvent(eventListElement, event));

    render(dayListComponent.getElement(), dayComponent.getElement());
  });
}
