import SortingView from '../view/sorting.js';
import DayListView from '../view/day-list.js';
import DayView from '../view/day.js';
import TripInfoView from '../view/trip-info.js';
import PageMessageView from '../view/page-message.js';
import EventPresenter from './event.js';
import EventNewPresenter from './event-new.js';
import {render, remove} from '../utils/render.js';
import {getDurationEvent} from '../utils/date.js';
import {filter} from '../utils/filter.js';
import {
  SortingTypes,
  UserAction,
  UpdateType,
  FilterType,
  MessagePage,
} from '../const.js';

const sortDuration = (eventA, eventB) => getDurationEvent(eventB) - getDurationEvent(eventA);
const sortPrice = (eventA, eventB) => eventB.cost - eventA.cost;

export default class TripPresenter {
  constructor(pageContainer, tripInfoContainer, eventsModel, filterModel, offersModel, destinationsModel) {
    this._tripInfoContainer = tripInfoContainer;
    this._pageContainer = pageContainer;
    this._tripContainer = pageContainer.querySelector(`.trip-events__trip-days`);
    this._sortContainer = pageContainer.querySelector(`.trip-events__trip-sort`);
    this._eventsModel = eventsModel;
    this._filterModel = filterModel;
    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;
    this._currentSortingType = SortingTypes.EVENT;
    this._eventPresenters = {};
    this._dayComponents = [];
    this._isLoading = true;

    this._tripInfoComponent = null;
    this._sortingComponent = null;
    this._pageMessageComponent = null;

    this._dayListComponent = new DayListView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortingTypeChange = this._handleSortingTypeChange.bind(this);

    this._eventsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._eventNewPresenter = new EventNewPresenter(
        this._tripContainer,
        this._offersModel,
        this._destinationsModel,
        this._handleViewAction,
    );
  }

  init() {
    this._renderTrip();
  }

  destroy() {
    this._clearTrip();
  }

  createEvent() {
    // рендер нового события
    this._currentSortingType = SortingTypes.EVENT;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._eventNewPresenter.init();
  }

  // возможные варианты:
  // 1) Нет событий - рендер собщения
  // -- меню
  // -- фильтры
  // -- сообщение (PageMessageView / _renderPageMassage)
  // 2) Есть события/нет сортировки - рендер вместе с днями
  // -- меню
  // -- фильтры
  // -- сортировка
  // -- список дней (dayList / ul)
  // -- дни (dayComponent / li > ul)
  // -- события (li)
  // 3) Есть события/есть сортировка - рендер без дней
  // -- меню
  // -- фильтры
  // -- сортировка
  // -- список дней (dayList / ul)
  // -- ОДИН день (dayComponent - пустой, без даты / li > ul)
  // -- события (li)
  // 4) Есть события/есть фильтр - рендер выбраных вместе с днями
  // -- так же как 2 или 3 пункт, сортировка подсвечивается
  // -- при смене фильтра и выборе статиситке сортировка сбрасывается
  // 5) Статистика - рендер статистики
  // -- меню
  // -- фильтры
  // -- статистика (div.page-body__container > section.statistics)


  _getEvents() {
    const events = this._eventsModel.getEvents();
    const filterType = this._filterModel.getFilter();
    const filtredEvents = filter[filterType](events);

    switch (this._currentSortingType) {
      case SortingTypes.TIME:
        return filtredEvents.sort(sortDuration);
      case SortingTypes.PRICE:
        return filtredEvents.sort(sortPrice);
      default:
        return filtredEvents;
    }
  }

  _handleModeChange() {
    this._eventNewPresenter.destroy();

    Object
      .values(this._eventPresenters)
      .forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(actionType, updateType, update) {
    // Здесь будем вызывать обновление модели.
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // update - обновленные данные

    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this._eventsModel.updateEvent(updateType, update);
        break;
      case UserAction.ADD_EVENT:
        this._eventsModel.addEvent(updateType, update);
        break;
      case UserAction.DELETE_EVENT:
        this._eventsModel.deleteEvent(updateType, update);
        break;
    }

    this._renderTripInfo();
  }

  _handleModelEvent(updateType, data) {
    // В зависимости от типа изменений решаем, что делать:
    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить часть списка (например, когда поменялось описание)
        this._eventPresenters[data.id].init(data);
        break;
      case UpdateType.MINOR:
        // - обновить список (например, когда событие удалилось)
        this._clearTrip();
        this._renderTrip();
        break;
      case UpdateType.MAJOR:
        // - обновить всю доску (например, при переключении фильтра)
        this._clearTrip({resetSortingType: true});
        this._renderTrip();
        break;
      case UpdateType.INIT:
        // - при загрузке или ошибки загрузки данных
        this._isLoading = false;
        remove(this._pageMessageComponent);
        this._renderTrip();
        break;
    }
  }

  _handleSortingTypeChange(sortingType) {
    // обработчик сортировки
    if (this._currentSortingType === sortingType) {
      return;
    }

    this._currentSortingType = sortingType;
    this._clearTrip();
    this._renderTrip();
  }

  _renderSorting() {
    // рендер панели сортировки
    if (this._sortingComponent !== null) {
      this._sortingComponent = null;
    }

    this._sortingComponent = new SortingView(this._currentSortingType);
    this._sortingComponent.setSortingTypeChangeHandler(this._handleSortingTypeChange);
    render(this._sortContainer, this._sortingComponent);
  }

  _renderEvent(dayСontainer, event) {
    // рендер события
    const eventPresenter = new EventPresenter(
        dayСontainer,
        this._offersModel,
        this._destinationsModel,
        this._handleViewAction,
        this._handleModeChange,
    );
    eventPresenter.init(event);
    this._eventPresenters[event.id] = eventPresenter;
  }

  _renderDay(events, date, i) {
    // рендер одного дня
    const dayComponent = new DayView(date, i);
    const dayСontainer = dayComponent.getElement().querySelector(`.trip-events__list`);
    this._dayComponents.push(dayComponent);

    if (this._currentSortingType === SortingTypes.EVENT) {
      events
        .filter((event) => event.startDate.toDateString() === date)
        .forEach((event) => this._renderEvent(dayСontainer, event));
    } else {
      events.forEach((event) => this._renderEvent(dayСontainer, event));
    }

    render(this._dayListComponent, dayComponent);
  }

  _renderDays(events) {
    // рендер несколько дней
    if (this._currentSortingType === SortingTypes.EVENT) {
      const datesEvents = [...new Set(events
        .map((event) => event.startDate.toDateString()))];

      datesEvents.forEach((date, i) => this._renderDay(events, date, i));
    } else {
      this._renderDay(events);
    }
  }

  _renderPageMassage(messagePage) {
    // рендер сообщение о отсутствии событий
    if (this._pageMessageComponent !== null) {
      this._pageMessageComponent = null;
    }

    this._pageMessageComponent = new PageMessageView(messagePage);
    render(this._tripContainer, this._pageMessageComponent);
  }

  // для обновления доски при сортировки и фильтрации
  _clearTrip({resetSortingType = false} = {}) { // нужен объект? может просто параметр? Может добавить параметр сброса фильтра?
    // удаления новой события
    this._eventNewPresenter.destroy();
    // удаление событий
    Object
      .values(this._eventPresenters)
      .forEach((presenter) => presenter.destroy());
    this._eventPresenters = {};
    // удаления дней
    this._dayComponents.forEach((day) => remove(day));
    this._dayComponents = [];

    // удаления меню сортировки
    remove(this._sortingComponent);
    // удаления сообщения о отсутствия задач
    remove(this._pageMessageComponent);
    // удаления списка дней
    remove(this._dayListComponent); // TODO: возможно его здесь не должно быть

    if (resetSortingType) {
      this._currentSortingType = SortingTypes.EVENT;
    }
  }

  _renderTrip() {
    if (this._isLoading) {
      this._renderPageMassage(MessagePage.LOADING);
      return;
    }

    const events = this._getEvents();

    if (events.length === 0) {
      this._renderPageMassage(MessagePage.NO_EVENT);
      return;
    }

    this._renderSorting();

    render(this._tripContainer, this._dayListComponent);

    this._renderDays(events);

    this._renderTripInfo();
  }

  _renderTripInfo() {
    if (this._tripInfoComponent !== null) {
      remove(this._tripInfoComponent);
      this._tripInfoComponent = null;
    }

    this._tripInfoComponent = new TripInfoView(this._getEvents());
    render(this._tripInfoContainer, this._tripInfoComponent);
  }
}
