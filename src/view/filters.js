import {capitalizeStr} from '../utils/common.js';
import AbstractView from "./abstract.js";

const FILTERS = [
  `everything`,
  `future`,
  `past`,
];

const createFiltersTemplate = (selectedFilter = `everything`) => {
  return (
    `<form class="trip-filters" action="#" method="get">
      ${FILTERS.map((filter) => `<div class="trip-filters__filter">
        <input
          id="filter-${filter}"
          class="trip-filters__filter-input visually-hidden"
          type="radio"
          name="trip-filter"
          value="${filter}"
          ${filter === selectedFilter ? `checked` : ``}
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
  getTemplate() {
    return createFiltersTemplate();
  }
}
