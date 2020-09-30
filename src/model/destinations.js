export default class DestinationsModel {
  setDestinations(destinations) {
    this._destinations = destinations.slice();
  }

  getDestinations() {
    return this._destinations;
  }

  getCities() {
    return this._destinations.map((destination) => destination.city);
  }
}
