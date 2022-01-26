import Observer from './observer.js';

export default class EventsModel extends Observer {
  constructor() {
    super();
    this._events = [];
  }

  setEvents(updateType, events) {
    this._sortEvents(events);

    this._notify(updateType);
  }

  getEvents() {
    return this._events;
  }

  updateEvent(updateType, update) {
    const index = this._events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting event`);
    }

    this._events.splice(index, 1, update);
    this._sortEvents(this._events);

    this._notify(updateType, update);
  }

  addEvent(updateType, update) {
    this._events.push(update);
    this._sortEvents(this._events);

    this._notify(updateType, update);
  }

  deleteEvent(updateType, update) {
    const index = this._events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error(`Can't delete unexisting event`);
    }

    this._events.splice(index, 1);

    this._notify(updateType);
  }

  _sortEvents(events) {
    this._events = events.slice().sort((a, b) => a.startDate - b.startDate);
  }

  static adaptToClient(event) {
    const adaptedEvent = {
      ...event,
      cost: event.base_price,
      isFavorites: event.is_favorite,
      startDate: new Date(event.date_from),
      endDate: new Date(event.date_to),
      destination: {
        city: event.destination.name,
        description: event.destination.description,
        photos: event.destination.pictures.map((photo) => ({
          src: photo.src,
          alt: photo.description,
        })),
      },
    };

    delete adaptedEvent.base_price;
    delete adaptedEvent.is_favorite;
    delete adaptedEvent.date_from;
    delete adaptedEvent.date_to;

    return adaptedEvent;
  }

  static adaptToServer(event) {
    const adaptedEvent = {
      ...event,
      'base_price': event.cost,
      'is_favorite': event.isFavorites,
      'date_from': event.startDate.toISOString(),
      'date_to': event.endDate.toISOString(),
      "destination": {
        name: event.destination.city,
        description: event.destination.description,
        pictures: event.destination.photos.map((photo) => ({
          src: photo.src,
          description: photo.alt,
        })),
      },
    };

    delete adaptedEvent.cost;
    delete adaptedEvent.isFavorites;
    delete adaptedEvent.startDate;
    delete adaptedEvent.endDate;

    return adaptedEvent;
  }
}
