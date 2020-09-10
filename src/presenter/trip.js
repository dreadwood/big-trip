import SortingView from '../view/sorting.js';
import DayListView from '../view/day-list.js';
import DayView from '../view/day.js';
import PageMessageView from '../view/page-message.js';
import EventPresenter from './event.js';
import {SortingTypes} from '../const.js';
import {render, remove} from '../utils/render.js';
import {getDurationEvent} from '../utils/date.js';
import {updateItem} from '../utils/common.js';

export default class TripPresenter {
  constructor(tripContainer) {
    this._tripContainer = tripContainer;
    this._currentSortingType = SortingTypes.EVENT;
    this._eventPresenters = {};
    this._dayComponents = [];

    this._sortingComponent = new SortingView();
    this._dayListComponent = new DayListView();

    this._handleEventChange = this._handleEventChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortingTypeChange = this._handleSortingTypeChange.bind(this);
  }

  init(events) {
    // инициализация
    this._events = events.slice();
    this._sourceEvents = events.slice();

    if (this._events.length === 0) {
      this._renderNoEvents();
    } else {
      this._renderSorting();
      this._renderDayList();
      this._renderDays();
    }
  }

  _handleModeChange() {
    Object
      .values(this._eventPresenters)
      .forEach((presenter) => presenter.resetView());
  }

  _handleEventChange(updatedEvent) {
    // обновляет список задач
    this._events = updateItem(this._events, updatedEvent);
    this._sourceEvents = updateItem(this._sourceEvents, updatedEvent);
    this._eventPresenters[updatedEvent.id].init(updatedEvent);
  }

  _sortEvents(sortingType) {
    // сортирует задачи
    switch (sortingType) {
      case SortingTypes.TIME:
        // сортировка по длительности
        this._events.sort((a, b) => getDurationEvent(b) - getDurationEvent(a));
        break;
      case SortingTypes.PRICE:
        // сортировка по цене
        this._events.sort((a, b) => b.cost - a.cost);
        break;
      default:
        this._events = this._sourceEvents.slice();
    }

    this._currentSortingType = sortingType;
    this._renderDays();
  }

  _handleSortingTypeChange(sortingType) {
    // обработчик сортировки
    if (this._currentSortingType === sortingType) {
      return;
    }

    this._clearTripList();
    this._sortEvents(sortingType);
  }

  _renderSorting() {
    // рендер панели сортировки
    render(this._tripContainer, this._sortingComponent);
    // установка обработчика сортировки
    this._sortingComponent.setSortingTypeChangeHandler(this._handleSortingTypeChange);
  }

  _renderNewEvent() {
    // рендер нового события
  }

  _renderEvent(dayСontainer, event) {
    // рендер события
    const eventPresenter = new EventPresenter(dayСontainer, this._handleEventChange, this._handleModeChange);
    eventPresenter.init(event);
    this._eventPresenters[event.id] = eventPresenter;
  }

  _renderDay(date, i) {
    // рендер одного дня
    const dayComponent = new DayView(date, i);
    const dayСontainer = dayComponent.getElement().querySelector(`.trip-events__list`);
    this._dayComponents.push(dayComponent);

    if (this._currentSortingType === SortingTypes.EVENT) {
      this._events
        .filter((event) => event.startDate.toDateString() === date)
        .forEach((event) => this._renderEvent(dayСontainer, event));
    } else {
      this._events.forEach((event) => this._renderEvent(dayСontainer, event));
    }

    render(this._dayListComponent, dayComponent);
  }

  _renderDays() {
    // рендер несколько дней
    if (this._currentSortingType === SortingTypes.EVENT) {
      const datesEvents = [...new Set(this._events
        .map((event) => event.startDate.toDateString()))];

      datesEvents.forEach((date, i) => this._renderDay(date, i));
    } else {
      this._renderDay();
    }
  }

  _renderDayList() {
    // рендер списка дней
    render(this._tripContainer, this._dayListComponent);
  }

  _renderNoEvents() {
    // рендер сообщение о отсутствии событий
    render(this._tripContainer, new PageMessageView());
  }

  _clearTripList() {
    // добавить удаление компонентов задач и дней
    Object
      .values(this._eventPresenters)
      .forEach((presenter) => presenter.destroy());
    this._eventPresenters = {};

    this._dayComponents.forEach((day) => remove(day));
    this._dayComponents = [];
  }
}
