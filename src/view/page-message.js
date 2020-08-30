import AbstractView from "./abstract.js";

const MESSAGE_NO_EVENT = `Click New Event to create your first point`;

const createPageMessageTemplate = () => {
  return (
    `<p class="trip-events__msg">${MESSAGE_NO_EVENT}</p>`
  );
};

export default class PageMessageView extends AbstractView {
  getTemplate() {
    return createPageMessageTemplate();
  }
}
