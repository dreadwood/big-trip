import EventView from '../view/event.js';
import EventEditView from '../view/event-edit.js';
import {render, replace} from '../utils/render.js';

export default class EventPresenter {
  constructor(dayСontainer) {
    this._dayСontainer = dayСontainer;

    this._eventComponent = null;
    this._eventEditComponent = null;

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleCardArrowButtonClick = this._handleCardArrowButtonClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleFormArrowButtonClick = this._handleFormArrowButtonClick.bind(this);
  }

  init(event) {
    this._event = event;

    this._eventComponent = new EventView(event);
    this._eventEditComponent = new EventEditView(event);

    this._eventComponent.setArrowButtonClickHandler(this._handleCardArrowButtonClick);

    this._eventEditComponent.setFormSubmitHandler(this._handleFormSubmit);

    this._eventEditComponent.setArrowButtonClickHandler(this._handleFormArrowButtonClick);

    render(this._dayСontainer, this._eventComponent);
  }

  _replaceCardToForm() {
    replace(this._eventEditComponent, this._eventComponent);
    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  _replaceFormToCard() {
    replace(this._eventComponent, this._eventEditComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._replaceFormToCard();
    }
  }

  _handleCardArrowButtonClick() {
    this._replaceCardToForm();
  }

  _handleFormSubmit() {
    this._replaceFormToCard();
  }

  _handleFormArrowButtonClick() {
    this._replaceFormToCard();
  }
}
