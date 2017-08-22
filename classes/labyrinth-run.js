const uuid = require('uuid/v4');

class LabyrinthRun {
  constructor() {
    this.listners = [];
    this.directions = [];
  }

  set directions(newDirections) {
    if (Array.isArray(newDirections)) {
      this.directions = newDirections;
    };
  }

  get directions() {
    return this.directions;
  }

  on(eventName, callback) {
    const id = uuid();
    this.listners.push({
      id,
      eventName,
      callback,
    });
    return id;
  }

  off(eventId) {
    this.listners = this.listners.filter(listner => listner.id !== eventId);
  }

  _listnerCaller(eventName, value) {
    this.listners.filter(listner => listner.eventName === eventName)
      .forEach(listner => listner.callback(value));
  }
}
