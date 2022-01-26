import EventEditView from '../view/event-edit.js';
import {render, remove, RenderPosition} from '../utils/render.js';
import {generateId} from '../utils/common.js';
import {UserAction, UpdateType} from '../const.js';

export default class EventNewPresenter {
  constructor(tripContainer, offersModel, destinationsModel, changeData) {
    this._tripContainer = tripContainer;
    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;
    this._changeData = changeData;

    this._eventEditComponent = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init() {
    if (this._eventEditComponent !== null) {
      return;
    }

    const offers = this._offersModel.getOffers();
    const destinations = this._destinationsModel.getDestinations();
    const cities = this._destinationsModel.getCities();

    this._eventEditComponent = new EventEditView(offers, destinations, cities);
    this._eventEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._eventEditComponent.setDeleteClickHandler(this._handleDeleteClick);

    render(this._tripContainer, this._eventEditComponent, RenderPosition.AFTER_BEGIN);

    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  destroy() {
    if (this._eventEditComponent === null) {
      return;
    }

    remove(this._eventEditComponent);
    this._eventEditComponent = null;

    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _handleFormSubmit(event) {
    this._changeData(
        UserAction.ADD_EVENT,
        UpdateType.MINOR, // возможно мажор, тк изменяеться фильтры (кол-во)
        Object.assign(event, {id: generateId()}),
    );
    this.destroy();
  }

  _handleDeleteClick() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this.destroy();
    }
  }
}
