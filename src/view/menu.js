import AbstractView from "./abstract.js";
import {MenuTabs} from "../const.js";

const createMenuTemplate = (selectedTab) => {
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      ${Object.values(MenuTabs).map((tab) => `<a
        class="trip-tabs__btn ${tab === selectedTab ? `trip-tabs__btn--active` : ``}"
        href="#"
      >${tab}</a>`).join(`\n`)}
    </nav>`
  );
};

export default class MenuView extends AbstractView {
  constructor() {
    super();

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createMenuTemplate(MenuTabs.TABLE);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener(`click`, this._menuClickHandler);
  }

  _changeSelectedTab(tab) {
    const prevSelectedTab = this.getElement().querySelector(`.trip-tabs__btn--active`);
    if (prevSelectedTab) {
      prevSelectedTab.classList.remove(`trip-tabs__btn--active`);
    }

    tab.classList.add(`trip-tabs__btn--active`);
  }

  _menuClickHandler(evt) {
    if (!evt.target.classList.contains(`trip-tabs__btn`)
      || evt.target.classList.contains(`trip-tabs__btn--active`)) {
      return;
    }

    evt.preventDefault();

    this._changeSelectedTab(evt.target);
    this._callback.menuClick(evt.target.textContent);
  }
}
