import {createElement} from '../utils/render.js';

const MESSAGE_NO_EVENT = `Click New Event to create your first point`;

const createPageMessageTemplate = () => {
  return (
    `<p class="trip-events__msg">${MESSAGE_NO_EVENT}</p>`
  );
};

export default class PageMessageView {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createPageMessageTemplate();
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
