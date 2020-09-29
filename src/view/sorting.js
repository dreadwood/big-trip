import {capitalizeStr} from '../utils/common.js';
import {SortingTypes} from '../const.js';
import AbstractView from "./abstract.js";

const createInputTemplate = (currentSorting) => Object.entries(SortingTypes).map(([type, value]) => {
  const typeName = type.toLowerCase();

  return (
    `<div class="trip-sort__item trip-sort__item--${typeName}">
        <input
          id="${value}"
          class="trip-sort__input  visually-hidden"
          type="radio"
          name="trip-sort"
          value="${value}"
          ${value === currentSorting ? `checked` : ``}
        >
        <label class="trip-sort__btn" for="sort-${typeName}">
          ${capitalizeStr(typeName)}
          ${value !== currentSorting ? `<svg
            class="trip-sort__direction-icon" width="8" height="10" viewBox="0 0 8 10">
              <path d="M2.888 4.852V9.694H5.588V4.852L7.91 5.068L4.238 0.00999987L0.548 5.068L2.888 4.852Z"/>
            </svg>` : ``}
        </label>
      </div>`
  );
});

const createSortingTemplate = (currentSorting) => {
  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      <span class="trip-sort__item  trip-sort__item--day">Day</span>

      ${createInputTemplate(currentSorting).join(`\n`)}

      <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
    </form>`
  );
};

export default class SortingView extends AbstractView {
  constructor(currentSortingType) {
    super();

    this._currentSortingType = currentSortingType;
    this._sortingTypeChangeHandler = this._sortingTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortingTemplate(this._currentSortingType);
  }

  _sortingTypeChangeHandler(evt) {
    if (evt.target.tagName !== `INPUT`) {
      return;
    }

    evt.preventDefault();
    this._callback.sortingTypeChange(evt.target.value);
  }

  setSortingTypeChangeHandler(callback) {
    this._callback.sortingTypeChange = callback;
    this.getElement().addEventListener(`change`, this._sortingTypeChangeHandler);
  }
}
