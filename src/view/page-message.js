import {MessagePage} from '../const.js';
import AbstractView from './abstract.js';


const createPageMessageTemplate = (message = MessagePage.NO_EVENT) => {
  return (
    `<p class="trip-events__msg">${message}</p>`
  );
};

export default class PageMessageView extends AbstractView {
  constructor(message) {
    super();

    this._message = message;
  }

  getTemplate() {
    return createPageMessageTemplate(this._message);
  }
}
