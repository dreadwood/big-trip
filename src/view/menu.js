import AbstractView from "./abstract.js";

const TABS = [
  `Table`,
  `Stats`
];

const createMenuTemplate = (selectedFilter) => {
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      ${TABS.map((item) => `<a
        class="trip-tabs__btn ${item === selectedFilter ? `trip-tabs__btn--active` : ``}"
        href="#"
      >${item}</a>`).join(`\n`)}
    </nav>`
  );
};

export default class MenuView extends AbstractView {
  constructor(selectedFilter = `Table`) {
    super();

    this._selectedFilter = selectedFilter;
  }

  getTemplate() {
    return createMenuTemplate(this._selectedFilter);
  }
}
