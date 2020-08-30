import SortingView from '../view/sorting.js';
import DayListView from '../view/day-list.js';
import DayView from '../view/day.js';
import EventView from '../view/event.js';
import EventEditView from '../view/event-edit.js';
import PageMessageView from '../view/page-message.js';
import {render, replace} from '../utils/render.js';

export default class TripPresenter {
  constructor(tripContainer) {
    this._tripContainer = tripContainer;

    this._sortingComponent = new SortingView();
    this._dayListComponent = new DayListView();
  }

  init(events) {
    // инициализация
    this._events = events;

    if (this._events.length === 0) {
      this._renderNoEvents();
    } else {
      this._renderSorting();
      this._renderDayList();
    }
  }

  _sortEvents() {
    // сортирует задачи
  }

  _handleSortTypeChange() {
    // обработчик сортировки
  }

  _renderSorting() {
    // рендер панели сортировки
    render(this._tripContainer, new SortingView());
    // установка обработчика сортировки
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

    this._events
      .filter((event) => event.startDate.toDateString() === date)
      .forEach((event) => this._renderEvent(dayСontainer, event));

    render(this._dayListComponent, dayComponent);
  }

  // разделить на дни / рендарить несколько дней

  _renderDayList() {
    // рендер списка дней
    render(this._tripContainer, this._dayListComponent);

    const datesEvents = [...new Set(this._events
      .map((event) => event.startDate.toDateString()))];

    datesEvents.forEach((date, i) => this._renderDay(date, i));
  }

  _renderNoEvents() {
    // рендер сообщение о отсутствии событий
    render(this._tripContainer, new PageMessageView());
  }
}
