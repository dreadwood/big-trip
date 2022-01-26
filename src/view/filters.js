import {capitalizeStr} from '../utils/common.js';
import AbstractView from './abstract.js';

const createFiltersTemplate = (filterItems, currentFilter) => {
  return (
    `<form class="trip-filters" action="#" method="get">
      ${filterItems.map(({type, count}) => `<div class="trip-filters__filter">
        <input
          id="filter-${type}"
          class="trip-filters__filter-input visually-hidden"
          type="radio"
          name="trip-filter"
          value="${type}"
          ${type === currentFilter ? `checked` : ``}
          ${count === 0 ? `disabled` : ``}
        >
        <label
          class="trip-filters__filter-label"
          for="filter-${type}"
        >${capitalizeStr(type)}</label>
      </div>`).join(`\n`)}

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

export default class FiltersView extends AbstractView {
  constructor(filters, currentFilterType) {
    super();

    this._filters = filters;
    this._currentFilter = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createFiltersTemplate(this._filters, this._currentFilter);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener(`change`, this._filterTypeChangeHandler);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }
}
