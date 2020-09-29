import TripInfoView from './view/trip-info.js';
import MenuView from './view/menu.js';
import EventsModel from './model/events.js';
import FilterModel from './model/filter.js';
// import StatisticView from './view/statistic.js';
import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';
import {generateTripEvent} from './mock/trip-event.js';
import {RenderPosition, render} from './utils/render.js';

const EVENT_COUNT = 20;

const events = new Array(EVENT_COUNT).fill(``)
  .map(generateTripEvent);

const eventsModel = new EventsModel();
eventsModel.setEvents(events);

const filterModel = new FilterModel();

const bodyElement = document.querySelector(`.page-body`);
const headerMainElement = bodyElement.querySelector(`.trip-main`);
const headerControlsElement = headerMainElement.querySelector(`.trip-controls`);
const pageContainerElement = bodyElement.querySelector(`.trip-events`); // this._tripContainer

render(headerMainElement, new TripInfoView(events), RenderPosition.AFTER_BEGIN); // информация о поездке
render(headerControlsElement, new MenuView(), RenderPosition.AFTER_BEGIN); // меню

const filterPresenter = new FilterPresenter(headerControlsElement, filterModel, eventsModel);
const tripPresenter = new TripPresenter(pageContainerElement, eventsModel);

filterPresenter.init();
tripPresenter.init();
