import Observer from './observer.js';

export default class EventsModel extends Observer {
  constructor() {
    super();
    this._events = [];
  }

  setEvents(events) {
    this._sortEvents(events);
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
}
