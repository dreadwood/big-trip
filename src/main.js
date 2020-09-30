import TripInfoView from './view/trip-info.js';
import MenuView from './view/menu.js';
import EventsModel from './model/events.js';
import FilterModel from './model/filter.js';
import OffersModel from './model/offers.js';
import DestinationsModel from './model/destinations.js';
// import StatisticView from './view/statistic.js';
import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';
import {generateTripEvent} from './mock/trip-event.js';
import {TYPES_OF_OFFERS} from './mock/offers.js';
import {destinationsList} from './mock/destinations.js';
import {RenderPosition, render} from './utils/render.js';

const EVENT_COUNT = 20;

const events = new Array(EVENT_COUNT).fill(``)
  .map(generateTripEvent);

const eventsModel = new EventsModel();
eventsModel.setEvents(events);

const filterModel = new FilterModel();
const offersModel = new OffersModel();
offersModel.setOffers(TYPES_OF_OFFERS);
const destinationsModel = new DestinationsModel();
destinationsModel.setDestinations(destinationsList);

const bodyElement = document.querySelector(`.page-body`);
const headerMainElement = bodyElement.querySelector(`.trip-main`);
const headerControlsElement = headerMainElement.querySelector(`.trip-controls`);
const pageContainerElement = bodyElement.querySelector(`.trip-events`); // this._tripContainer

render(headerMainElement, new TripInfoView(events), RenderPosition.AFTER_BEGIN); // информация о поездке
render(headerControlsElement, new MenuView(), RenderPosition.AFTER_BEGIN); // меню

const filterPresenter = new FilterPresenter(headerControlsElement, filterModel, eventsModel);
const tripPresenter = new TripPresenter(pageContainerElement, eventsModel, filterModel, offersModel, destinationsModel);

filterPresenter.init();
tripPresenter.init();

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  tripPresenter.createEvent();
});
