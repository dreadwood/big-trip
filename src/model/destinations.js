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

  static adaptToClient(destination) {
    const adaptedDestination = {
      ...destination,
      city: destination.name,
      photos: destination.pictures.map((photo) => ({
        src: photo.src,
        alt: photo.description,
      })),
    };

    delete adaptedDestination.city;
    delete adaptedDestination.pictures;

    return adaptedDestination;
  }
}
