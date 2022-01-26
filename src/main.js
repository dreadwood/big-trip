import MenuView from './view/menu.js';
import StatisticView from './view/statistic.js';
import EventsModel from './model/events.js';
import FilterModel from './model/filter.js';
import OffersModel from './model/offers.js';
import DestinationsModel from './model/destinations.js';
import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';
import Api from './api/api.js';
import {render, remove} from './utils/render.js';
import {UpdateType} from './const.js';

const AUTHORIZATION = `Basic hSsilf82dcl1sa2j`;
const END_POINT = `https://15.ecmascript.pages.academy/big-trip`;

const infoContainer = document.querySelector(`.trip-main__trip-info`);
const tabsContainer = document.querySelector(`.trip-controls__trip-tabs`);
const filtersContainer = document.querySelector(`.trip-controls__trip-filters`);
const pageContainer = document.querySelector(`.trip-events`);

const eventsModel = new EventsModel();
const filterModel = new FilterModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();

const api = new Api(END_POINT, AUTHORIZATION);

const filterPresenter = new FilterPresenter(
    filtersContainer,
    filterModel,
    eventsModel,
);
const tripPresenter = new TripPresenter(
    pageContainer,
    infoContainer,
    eventsModel,
    filterModel,
    offersModel,
    destinationsModel,
);

const menuComponent = new MenuView();


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
      render(pageContainer, statisticComponent);
      break;
  }
};

menuComponent.setMenuClickHandler(handleSiteMenuClick);

document.querySelector(`.trip-main__event-add-btn`)
  .addEventListener(`click`, (evt) => {
    evt.preventDefault();
    tripPresenter.createEvent();
  });

filterPresenter.init();
tripPresenter.init();

Promise.all([
  api.getOffers(),
  api.getDestinations(),
  api.getEvents(),
])
  .then(([offers, destinations, events]) => {
    offersModel.setOffers(offers);
    destinationsModel.setDestinations(destinations);
    eventsModel.setEvents(UpdateType.INIT, events);
    render(tabsContainer, menuComponent);
  })
  .catch(() => {
    eventsModel.setEvents(UpdateType.INIT, []);
    render(tabsContainer, menuComponent);
  });
