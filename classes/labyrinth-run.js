const uuid = require('uuid/v4');

class LabyrinthRun {
  constructor() {
    this.triggers = [];
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
    this.triggers.push({
      id,
      eventName,
      callback,
    });
    return id;
  }

  off(eventId) {
    this.triggers = this.triggers.filter(trigger => trigger.id !== eventId);
  }

  _triggerCaller(eventName, value) {
    this.triggers.filter(trigger => trigger.eventName === eventName)
      .forEach(trigger => trigger.callback(value));
  }
}
