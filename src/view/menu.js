import {createElement} from '../utils/render.js';

const TABS = [
  `Table`,
  `Stats`
];

export const createMenuTemplate = (selectedFilter) => {
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      ${TABS.map((item) => `<a
        class="trip-tabs__btn ${item === selectedFilter ? `trip-tabs__btn--active` : ``}"
        href="#"
      >${item}</a>`).join(`\n`)}
    </nav>`
  );
};

export default class MenuView {
  constructor(selectedFilter = `Table`) {
    this._element = null;
    this._selectedFilter = selectedFilter;
  }

  getTemplate() {
    return createMenuTemplate(this._selectedFilter);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
