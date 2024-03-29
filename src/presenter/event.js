import EventView from '../view/event.js';
import EventEditView from '../view/event-edit.js';
import {render, replace, remove} from '../utils/render.js';
import {isDatesEqual} from '../utils/date.js';
import {UserAction, UpdateType} from '../const.js';

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`,
};

export const State = {
  SAVING: `SAVING`,
  DELETING: `DELETING`,
  ABORTING: `ABORTING`,
};

export default class EventPresenter {
  constructor(dayСontainer, offersModel, destinationsModel, changeData, changeMode) {
    this._dayСontainer = dayСontainer;
    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._eventComponent = null;
    this._eventEditComponent = null;
    this._mode = Mode.DEFAULT;

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleCardArrowButtonClick = this._handleCardArrowButtonClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleFormArrowButtonClick = this._handleFormArrowButtonClick.bind(this);
    this._handleCardFavoriteClick = this._handleCardFavoriteClick.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
  }

  init(event) {
    this._event = event;

    const offers = this._offersModel.getOffers();
    const destinations = this._destinationsModel.getDestinations();
    const cities = this._destinationsModel.getCities();

    const prevEventComponent = this._eventComponent;
    const prevEventEditComponent = this._eventEditComponent;

    this._eventComponent = new EventView(event);
    this._eventEditComponent = new EventEditView(offers, destinations, cities, event);

    this._eventComponent.setArrowButtonClickHandler(this._handleCardArrowButtonClick);
    this._eventEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._eventEditComponent.setArrowButtonClickHandler(this._handleFormArrowButtonClick);
    this._eventComponent.setFavoritesClickHandler(this._handleCardFavoriteClick);
    this._eventEditComponent.setDeleteClickHandler(this._handleDeleteClick);

    if (prevEventComponent === null || prevEventEditComponent === null) {
      render(this._dayСontainer, this._eventComponent);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._eventComponent, prevEventComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._eventComponent, prevEventEditComponent);
      this._mode = Mode.DEFAULT;
    }

    remove(prevEventComponent);
    remove(prevEventEditComponent);
  }

  destroy() {
    remove(this._eventComponent);
    remove(this._eventEditComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._eventEditComponent.reset(this._event);
      this._replaceFormToCard();
    }
  }

  setViewState(state) {
    const resetFormState = () => {
      this._eventEditComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    switch (state) {
      case State.SAVING:
        this._eventEditComponent.updateData({
          isDisabled: true,
          isSaving: true,
        });
        break;
      case State.DELETING:
        this._eventEditComponent.updateData({
          isDisabled: true,
          isDeleting: true,
        });
        break;
      case State.ABORTING:
        this._eventEditComponent.shake(resetFormState);
        break;
    }
  }

  _replaceCardToForm() {
    replace(this._eventEditComponent, this._eventComponent);
    document.addEventListener(`keydown`, this._escKeyDownHandler);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceFormToCard() {
    replace(this._eventComponent, this._eventEditComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._eventEditComponent.reset(this._event);
      this._replaceFormToCard();
    }
  }

  _handleCardArrowButtonClick() {
    this._replaceCardToForm();
  }

  _handleCardFavoriteClick(event) {
    this._changeData(
        UserAction.UPDATE_EVENT,
        UpdateType.MINOR,
        {
          ...event,
          isFavorites: !this._event.isFavorites,
        },
    );
  }

  _handleFormSubmit(update) {
    const isMinorUpdate = this._event.cost !== update.cost
      || this._event.isFavorites !== update.isFavorites
      || !isDatesEqual(this._event.startDate, update.startDate)
      || !isDatesEqual(this._event.endDate, update.endDate);

    this._changeData(
        UserAction.UPDATE_EVENT,
        isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
        update,
    );
  }

  _handleDeleteClick(event) {
    this._changeData(
        UserAction.DELETE_EVENT,
        UpdateType.MINOR,
        event,
    );
  }

  _handleFormArrowButtonClick() {
    this._eventEditComponent.reset(this._event);
    this._replaceFormToCard();
  }
}
