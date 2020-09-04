import SortingView from '../view/sorting.js';
import DayListView from '../view/day-list.js';
import DayView from '../view/day.js';
import EventView from '../view/event.js';
import EventEditView from '../view/event-edit.js';
import PageMessageView from '../view/page-message.js';
import {SortingTypes} from '../const.js';
import {render, replace} from '../utils/render.js';

const getDuration = (event) => event.endDate - event.startDate;

export default class TripPresenter {
  constructor(tripContainer) {
    this._tripContainer = tripContainer;
    this._currentSortingType = SortingTypes.EVENT;

    this._sortingComponent = new SortingView();
    this._dayListComponent = new DayListView();

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

  _sortEvents(sortingType) {
    // сортирует задачи
    switch (sortingType) {
      case SortingTypes.TIME:
        // сортировка по длительности
        this._events.sort((a, b) => getDuration(b) - getDuration(a));
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
    const eventComponent = new EventView(event);
    const eventEditComponent = new EventEditView(event);

    const replaceCardToForm = () => {
      replace(eventEditComponent, eventComponent);
    };

    const replaceFormToCard = () => {
      replace(eventComponent, eventEditComponent);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        evt.preventDefault();
        replaceFormToCard();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    eventComponent.setArrowButtonClickHandler(() => {
      replaceCardToForm();
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    eventEditComponent.setFormSubmitHandler(() => {
      replaceFormToCard();
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

    eventEditComponent.setArrowButtonClickHandler(() => {
      replaceFormToCard();
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

    render(dayСontainer, eventComponent);
  }

  _renderDay(date, i) {
    // рендер одного дня
    const dayComponent = new DayView(date, i);
    const dayСontainer = dayComponent.getElement().querySelector(`.trip-events__list`);

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
    this._dayListComponent.getElement().innerHTML = ``;
  }
}
