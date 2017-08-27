const uuid = require('uuid/v4');
const Tail = require('always-tail');
const fs = require('fs');
const { splitLines, shapeLog } = require('../utils');
const { readPromise } = require('../utils/fs');
const { plazaIdentifier, roomIdentifier, izaroQuote, izaroFinalDialogue, leftLabyrinth } = require('../utils/labyrinth');

class LabyrinthRun {
  constructor(logPath = '../../Games/PathOfExile/logs/Client.txt') {
    this.triggers = [];
    this.currentDirections = [];
    this.logPath = logPath;
    this.tail = null;
    this.runProgress = 0;
    this.lastIzaroQuoteEntry = null;
    this.intervalId = null;
    this.startTime = new Date();

    this.getRunPhase = this.getRunPhase.bind(this);
    this._advancePhase = this._advancePhase.bind(this);
    this._getDirection = this._getDirection.bind(this);
    this._setDirections = this._setDirections.bind(this);
    this._startTailing = this._startTailing.bind(this);
    this._triggerCaller = this._triggerCaller.bind(this);
    this._tailHandler = this._tailHandler.bind(this);
    this._updateTime = this._updateTime.bind(this);

    readPromise('./directions.txt')
    .then(data => {
      this._setDirections(splitLines(data));
    });

    this._startTailing(this.logPath);
  }

  _setDirections(newDirections) {
    if (Array.isArray(newDirections)) {
      this.currentDirections = [
        'standby',
        'ready',
        ...newDirections,
      ];
      this._triggerCaller('directions-loaded', this.currentDirections);
      this._triggerCaller('progress-changed', this.runProgress);
      this._triggerCaller('current-direction-changed', null);
    };
  }

  set directions(newDirections) {
    this._setDirections(newDirections);
  }

  get directions() {
    return this.currentDirections;
  }

  _getDirection(skip = 0) {
    const directionIndex = this.runProgress + skip;
    return directionIndex >= this.directions.length ?
      'Finish!' :
      this.directions[directionIndex];
  }

  get currentDirection() {
    return this._getDirection(0);
  }
  get nextDirection() {
    return this._getDirection(1);
  }

  getRunPhase(skip = 0) {
    return this._getDirection(skip).includes('zaro') ? 'izaro' : this._getDirection(skip);
  }

  _advancePhase(reset = false) {
    if (reset) {
      this.runProgress = 0;
    } else {
      this.runProgress += 1;
    }
    this._triggerCaller('progress-changed', this.runProgress);
    this._triggerCaller('current-direction-changed', null);
  }

  _tailHandler(line) {
    const logEntries = shapeLog(line);
    if (logEntries.length > 0) {
      logEntries.forEach(logEntry => {
        const room = roomIdentifier(logEntry);
        const izaro = izaroQuote(logEntry);
        switch (this.getRunPhase(1)) { // Check next phase
          case 'ready':
            if (plazaIdentifier(logEntry)) {
              this._advancePhase();
            }
            break;
          case 'izaro':
            if (izaro) {
              this.lastIzaroQuoteEntry = logEntry;
              this._advancePhase();
            }
            break;
          case 'Finish!':
            if (izaro && izaroFinalDialogue.includes(izaro)) {
              this._advancePhase();
              clearInterval(this.intervalId);
              this.intervalId = null;
              this._updateTime(logEntry.timestamp);
            }
          case 'room':
          default:
            if (room) {
              if (this.getRunPhase(0) === 'ready') {
                this.startTime = logEntry.timestamp;
                this.intervalId = setInterval(this._updateTime, 340);
              }
              this._advancePhase();
            }
        }
        if (leftLabyrinth(logEntry)) {
          this._advancePhase(true);
          clearInterval(this.intervalId);
          this.intervalId = null;
          const { lastIzaroQuoteEntry } = this;
          if (lastIzaroQuoteEntry) {
            this._updateTime(lastIzaroQuoteEntry.timestamp);
            fs.appendFile('final-izaro-quotes.txt', `${izaroQuote(lastIzaroQuoteEntry)}
            `);
          }
          this.lastIzaroQuoteEntry = null;
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

  _updateTime(manualTime = false) {
    const now = manualTime || new Date();
    const seconds = Math.round((now - this.startTime) / 1000);
    const m = Math.floor(seconds / 60);
    let s = `${seconds - (m * 60)}`;
    if (s.length === 1) {
      s = `0${s}`;
    }
    document.getElementById('timer').textContent = `${m}:${s}`
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