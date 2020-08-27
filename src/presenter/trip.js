import SortingView from '../view/sorting.js';
import DayListView from '../view/day-list.js';
import DayView from '../view/day.js';
import EventView from '../view/event.js';
import EventEditView from '../view/event-edit.js';
import PageMessageView from '../view/page-message.js';
import {RenderPosition, render, replace} from './utils/render.js';

export default class Trip {
  constructor(tripContainer) {
    this._tripContainer = tripContainer;

    this._sortingComponent = new SortingView();
    this._dayListComponent = new DayListView();
    this._pageMessageComponent = new PageMessageView();
  }

  init() {
    // инициализация
  }

  _sortEvents() {
    // сортирует задачи
  }

  _handleSortTypeChange() {
    // обработчик сортировки
  }

  _renderSorting() {
    // рендер панели сортировки
    // установка обработчика сортировки
  }

  _renderDay() {
    // рендер одного дня
  }

  // разделить на дни / редарить несколько дней

  _renderDayList() {
    // рендер списка дней
  }

  _renderEvent(event) {
    // рендер события
  }

  _renderNewEvent() {
    // рендер нового события
  }

  _renderNoEvents() {
    // рендер сообщение о отсутствии событий
  }
}
