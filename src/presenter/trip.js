import SortingView from '../view/sorting.js';
import DayListView from '../view/day-list.js';
import DayView from '../view/day.js';
import PageMessageView from '../view/page-message.js';
import EventPresenter from './event.js';
import EventNewPresenter from './event-new.js';
import {SortingTypes, UserAction, UpdateType, FilterType} from '../const.js';
import {render, remove} from '../utils/render.js';
import {getDurationEvent} from '../utils/date.js';
import {filter} from '../utils/filter.js';

const sortDuration = (eventA, eventB) => getDurationEvent(eventB) - getDurationEvent(eventA);
const sortPrice = (eventA, eventB) => eventB.cost - eventA.cost;
const sortStartDate = (eventA, eventB) => eventA.startDate - eventB.startDate;

export default class TripPresenter {
  constructor(tripContainer, eventsModel, filterModel, offersModel, destinationsModel) {
    this._tripContainer = tripContainer;
    this._eventsModel = eventsModel;
    this._filterModel = filterModel;
    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;
    this._currentSortingType = SortingTypes.EVENT;
    this._eventPresenters = {};
    this._dayComponents = [];

    this._sortingComponent = null;

    this._dayListComponent = new DayListView();
    this._pageMessageComponent = new PageMessageView();

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
        this._handleViewAction
    );
  }

  init() {
    // инициализация
    this._renderTrip();
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
  // -- сообщение (PageMessageView / _renderNoEvents)
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

  // TO-DO:
  // 1) проверить компонент event edit на наличие обертки li (нужно испрвить)
  // -- новые события вставляються без обертки li над списком дней (dayList / ul)
  // -- при редактировании собития есть обертка li.trip-events__item
  // -- как у не раскрытого события
  // 2) выбор дополнительных опций влияет на общую стоимость путешествия
  // 3) добавить сортировку при добавлении новой точки маршрута
  // -- один из вариантов, добавить это в модель в метод addEvent
  // -- так же возможно стоит добавить сортировку по датам в презентер trip в метод _getEvents()
  // 4) проверить что колонке «Offers» отображаются не более 3-х дополнительных опций
  // 5) решить что делать с ф-циями sortDuration() и sortPrice()
  // -- сохранить оставить, сохранить вынести, упразднить
  // 6) при нажатии на избранное убрать перерисовку
  // 7) Упростить рендер при сортировки, чтобы избавиться от повторяющихся вызовов ф-ций
  // -- и проверок условий
  // 8) может вынести создание PageMessageView из конструктор какой-нибудь метод
  // 9) если выбрать промежуток больше чем день длительность учитывает только часы
  // 10 при выборе endDate значение в форме сбрасывается
  // 11 убедиться, что фильтры работают правильно (сортировка + условия фильтрации)
  // 12 проверить элементы, которые должны становиться не активными по ТЗ
  // 13 добавить пересчет денег и маршрута при добавлении и удалении задачи
  // 14 выставить везде одинаковые ковычки


  // DONE:
  //  1) восстановить работу сортировки
  //  2) проверка в init (this._getEvents().length === 0) завтавляет два раза
  //  -- вызывать данные из модели (те запускать _getEvents())
  //  3) проверить корректно работает isDatesEqual из utils/date
  //  -- при изменении даты в собитии должна перерисовываться вся доска (для запуска сортировки)
  //  4) убрать из представления фильтров словарь
  //  5) добавить модели для других структур данных
  //  6) стоимость должна быть больше 0


  _getEvents() {
    const filterType = this._filterModel.getFilter();
    const events = this._eventsModel.getEvents();
    const filtredEvents = filter[filterType](events);

    switch (this._currentSortingType) {
      case SortingTypes.TIME:
        return filtredEvents.sort(sortDuration);
      case SortingTypes.PRICE:
        return filtredEvents.sort(sortPrice);
      default:
        return filtredEvents.sort(sortStartDate);
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
        this._clearTrip();
        this._renderTrip({resetSortingType: true});
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
    // установка обработчика сортировки
    this._sortingComponent.setSortingTypeChangeHandler(this._handleSortingTypeChange);
    render(this._tripContainer, this._sortingComponent);
  }

  _renderEvent(dayСontainer, event) {
    // рендер события
    const eventPresenter = new EventPresenter(
        dayСontainer,
        this._offersModel,
        this._destinationsModel,
        this._handleViewAction,
        this._handleModeChange
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

  _renderNoEvents() {
    // рендер сообщение о отсутствии событий
    render(this._tripContainer, this._pageMessageComponent);
  }

  _clearTrip({resetSortingType = false} = {}) {
    this._eventNewPresenter.destroy();
    // удаление компонентов задач и дней
    Object
      .values(this._eventPresenters)
      .forEach((presenter) => presenter.destroy());
    this._eventPresenters = {};

    this._dayComponents.forEach((day) => remove(day));
    this._dayComponents = [];
    // end

    remove(this._sortingComponent);
    remove(this._pageMessageComponent);
    remove(this._dayListComponent); // возможно его здесь не должно быть

    if (resetSortingType) {
      this._currentSortingType = SortingTypes.EVENT;
    }
  }

  _renderTrip() {
    const events = this._getEvents();

    if (events === 0) {
      this._renderNoEvents();
      return;
    }

    this._renderSorting();

    render(this._tripContainer, this._dayListComponent);

    this._renderDays(events);
  }
}
