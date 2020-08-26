import AbstractView from "./abstract.js";

const createDayListTemplate = () => {
  return (
    `<ul class="trip-days"></ul>`
  );
};

export default class DayListView extends AbstractView {
  getTemplate() {
    return createDayListTemplate();
  }
}
