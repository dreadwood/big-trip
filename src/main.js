import TripInfoView from './view/trip-info.js';
import MenuView from './view/menu.js';
import StatisticView from './view/statistic.js';
import EventsModel from './model/events.js';
import FilterModel from './model/filter.js';
import OffersModel from './model/offers.js';
import DestinationsModel from './model/destinations.js';
import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';
import {generateTripEvent} from './mock/trip-event.js';
import {TYPES_OF_OFFERS} from './mock/offers.js';
import {destinationsList} from './mock/destinations.js';
import {RenderPosition, render, remove} from './utils/render.js';

const EVENT_COUNT = 20;

const events = new Array(EVENT_COUNT).fill(``)
  .map(generateTripEvent);

const eventsModel = new EventsModel();
const filterModel = new FilterModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();
offersModel.setOffers(TYPES_OF_OFFERS);
eventsModel.setEvents(events);
destinationsModel.setDestinations(destinationsList);

const bodyElement = document.querySelector(`.page-body`);
const headerMainElement = bodyElement.querySelector(`.trip-main`);
const headerControlsElement = headerMainElement.querySelector(`.trip-controls`);
const pageContainerElement = bodyElement.querySelector(`.trip-events`); // this._tripContainer

render(headerMainElement, new TripInfoView(events), RenderPosition.AFTER_BEGIN); // инфо (пункты, даты и цена)
const menuComponent = new MenuView();
render(headerControlsElement, menuComponent, RenderPosition.AFTER_BEGIN); // меню (список дней, статистика)

let statisticComponent = null;

const handleSiteMenuClick = (tab) => {
  switch (tab) {
    case `Table`:
      // Показать доску
      filterPresenter.init();
      tripPresenter.init();
      // Скрыть статистику
      remove(statisticComponent);
      statisticComponent = null;
      break;
    case `Stats`:
      // Скрыть доску
      filterPresenter.destroy();
      tripPresenter.destroy();
      // Показать статистику
      statisticComponent = new StatisticView(eventsModel.getEvents());
      render(pageContainerElement, statisticComponent);
      break;
  }
};

const filterPresenter = new FilterPresenter(headerControlsElement, filterModel, eventsModel);
const tripPresenter = new TripPresenter(pageContainerElement, eventsModel, filterModel, offersModel, destinationsModel);

menuComponent.setMenuClickHandler(handleSiteMenuClick);

filterPresenter.init();
tripPresenter.init();

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  tripPresenter.createEvent();
});
