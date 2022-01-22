import MenuView from './view/menu.js';
import StatisticView from './view/statistic.js';
import EventsModel from './model/events.js';
import FilterModel from './model/filter.js';
import OffersModel from './model/offers.js';
import DestinationsModel from './model/destinations.js';
import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';
import {generateTripEvent} from './mock/event.js';
import {TYPES_OF_OFFERS} from './mock/offers.js';
import {destinationsList} from './mock/destinations.js';
import {render, remove} from './utils/render.js';

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

const infoContainer = document.querySelector(`.trip-main__trip-info`);
const tabsContainer = document.querySelector(`.trip-controls__trip-tabs`);
const filtersContainer = document.querySelector(`.trip-controls__trip-filters`);
const pageContainer = document.querySelector(`.trip-events`);

const menuComponent = new MenuView();
render(tabsContainer, menuComponent); // меню (table, stat)

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

const filterPresenter = new FilterPresenter(filtersContainer, filterModel, eventsModel);
const tripPresenter = new TripPresenter(pageContainer, infoContainer, eventsModel, filterModel, offersModel, destinationsModel);

menuComponent.setMenuClickHandler(handleSiteMenuClick);

filterPresenter.init();
tripPresenter.init();

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  tripPresenter.createEvent();
});
