export default class OffersModel {
  setOffers(events) {
    this._offers = events.slice();
  }

  getOffers() {
    return this._offers;
  }
}
