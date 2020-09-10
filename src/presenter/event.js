import EventView from '../view/event.js';
import EventEditView from '../view/event-edit.js';
import {render, replace, remove} from '../utils/render.js';

export default class EventPresenter {
  constructor(dayСontainer, changeData) {
    this._dayСontainer = dayСontainer;
    this._changeData = changeData;

    this._eventComponent = null;
    this._eventEditComponent = null;

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleCardArrowButtonClick = this._handleCardArrowButtonClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleFormArrowButtonClick = this._handleFormArrowButtonClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
  }

  init(event) {
    this._event = event;

    const prevEventComponent = this._eventComponent;
    const prevEventEditComponent = this._eventEditComponent;

    this._eventComponent = new EventView(event);
    this._eventEditComponent = new EventEditView(event);

    this._eventComponent.setArrowButtonClickHandler(this._handleCardArrowButtonClick);
    this._eventEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._eventEditComponent.setArrowButtonClickHandler(this._handleFormArrowButtonClick);
    this._eventEditComponent.setFavoritesClickHandler(this._handleFavoriteClick);

    if (prevEventComponent === null || prevEventEditComponent === null) {
      render(this._dayСontainer, this._eventComponent);
      return;
    }

    if (this._dayСontainer.contains(prevEventComponent.getElement())) {
      replace(this._eventComponent, prevEventComponent);
    }

    if (this._dayСontainer.contains(prevEventEditComponent.getElement())) {
      replace(this._eventEditComponent, prevEventEditComponent);
    }

    remove(prevEventComponent);
    remove(prevEventEditComponent);
  }

  destroy() {
    remove(this._eventComponent);
    remove(this._eventEditComponent);
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

  _handleFavoriteClick(event) {
    this._changeData(
        Object.assign(
            {},
            event,
            {
              isFavorites: !this._event.isFavorites
            }
        )
    );
  }

  _handleFormSubmit(event) {
    this._replaceFormToCard();
    this._changeData(event);
  }

  _handleFormArrowButtonClick() {
    this._replaceFormToCard();
  }
}
