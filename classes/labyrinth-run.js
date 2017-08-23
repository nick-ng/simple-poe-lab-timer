const uuid = require('uuid/v4');
const Tail = require('always-tail');
const { splitLines, shapeLog } = require('../utils');
const { readPromise } = require('../utils/fs');
const { roomIdentifier, izaroQuote } = require('../utils/labyrinth');

class LabyrinthRun {
  constructor(logPath = '../../Games/PathOfExile/logs/Client.txt') {
    this.triggers = [];
    this.currentDirections = [];
    this.logPath = logPath;
    this.tail = null;
    this.runProgress = -1;

    this.getRunPhase = this.getRunPhase.bind(this);
    this._startTailing = this._startTailing.bind(this);
    this._triggerCaller = this._triggerCaller.bind(this);
    this._tailHandler = this._tailHandler.bind(this);

    readPromise('./directions.txt')
    .then(data => {
      this.currentDirections = splitLines(data);
      this._triggerCaller('directions-loaded', this.currentDirections);
      this._triggerCaller('progress-changed', this.runProgress);
      this._triggerCaller('current-direction-changed', null);
    });

    this._startTailing(this.logPath);
  }

  set directions(newDirections) {
    if (Array.isArray(newDirections)) {
      this.currentDirections = newDirections;
    };
  }

  get directions() {
    return this.currentDirections;
  }

  get currentDirection() {
    return this.runProgress < 0 ?
      'Standby' :
      this.directions[this.runProgress];
  }

  get nextDirection() {
    const nextProgress = this.runProgress + 1;
    return nextProgress >= this.directions.length ?
      'Finish!' :
      this.directions[nextProgress];
  }

  getRunPhase() {
    if (this.runProgress < 0) {
      return 'standby';
    }
    const direction = this.directions[this.runProgress];
    if (direction.includes('zaro')) {
      return 'izaro';
    }
    return 'room';
  }

  _tailHandler(line) {
    const logEntries = shapeLog(line);
    if (logEntries.length > 0) {
      logEntries.forEach(logEntry => {
        switch (this.getRunPhase()) {
          case 'standby':
          case 'izaro':
            const room = roomIdentifier(logEntry);
            if (room) {
              console.log('room', room);
              this.runProgress += 1;
              this._triggerCaller('progress-changed', this.runProgress);
              this._triggerCaller('current-direction-changed', null);
            }
            break;
          case 'room':
          default:
            const izaro = izaroQuote(logEntry);
            if (izaro) {
              console.log('izaro', izaro);
              this.runProgress += 1;
              this._triggerCaller('progress-changed', this.runProgress);
              this._triggerCaller('current-direction-changed', null);
            }
            break;
        }
      });
    }
  }

  _startTailing(logPath, separator = '\n') {
    if (this.tail) {
      this.tail.unwatch();
    }
    this.tail = new Tail(logPath, separator, 340);
    this.tail.on('line', this._tailHandler);
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

module.exports = LabyrinthRun;