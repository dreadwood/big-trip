import {capitalizeStr} from '../utils/common.js';
import {FilterType} from '../const.js';
import AbstractView from "./abstract.js";

const createFiltersTemplate = (currentFilter) => {
  return (
    `<form class="trip-filters" action="#" method="get">
      ${Object.values(FilterType).map((filter) => `<div class="trip-filters__filter">
        <input
          id="filter-${filter}"
          class="trip-filters__filter-input visually-hidden"
          type="radio"
          name="trip-filter"
          value="${filter}"
          ${filter === currentFilter ? `checked` : ``}
        >
        <label
          class="trip-filters__filter-label"
          for="filter-${filter}"
        >${capitalizeStr(filter)}</label>
      </div>`).join(`\n`)}

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

export default class FiltersView extends AbstractView {
  constructor(currentFilterType) {
    super();

    this._currentFilter = currentFilterType;
  }

  getTemplate() {
    return createFiltersTemplate(this._currentFilter);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener(`change`, this._filterTypeChangeHandler);
  }
}
