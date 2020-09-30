import FiltersView from '../view/filters.js';
import {render, replace, remove} from '../utils/render.js';
import {filter} from '../utils/filter.js';
import {UpdateType} from '../const.js';

export default class FilterPresenter {
  constructor(filterContainer, filterModel, eventsModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._eventsModel = eventsModel;
    this._currentFilter = null;

    this._filterComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._eventsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent); // нужно ли?
  }

  init() {
    this._currentFilter = this._filterModel.getFilter();

    const filters = this._getFilters();
    const prevFilterComponent = this._filterComponent; // нужно ли?

    this._filterComponent = new FiltersView(filters, this._currentFilter);
    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if (prevFilterComponent === null) { // нужно ли?
      render(this._filterContainer, this._filterComponent);
      return;
    }

    replace(this._filterComponent, prevFilterComponent); // нужно ли?
    remove(prevFilterComponent); // нужно ли?
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._currentFilter === filterType) {
      return;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  _getFilters() {
    // масив типов фильтров и колличество событий по каждому из них
    const events = this._eventsModel.getEvents();

    return Object.entries(filter).map(([type, filterEvents]) => {
      return {
        type,
        count: filterEvents(events).length,
      };
    });
  }
}
