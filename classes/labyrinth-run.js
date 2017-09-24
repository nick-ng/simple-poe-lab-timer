const uuid = require('uuid/v4');
const Tail = require('always-tail');
const fs = require('fs');
const { splitLines, shapeLog, secondsToMinutes } = require('../utils');
const { readPromise } = require('../utils/fs');
const { plazaIdentifier, slainIdentifier, roomIdentifier, izaroQuote, izaroFinalDialogue, leftLabyrinth } = require('../utils/labyrinth');

class LabyrinthRun {
  constructor(logPath = '../../Games/PathOfExile/logs/Client.txt') {
    this.triggers = [];
    this.logPath = logPath;
    this.tail = null;
    this.runPhase = 'standby';
    this.lastIzaroQuoteEntry = null;
    this.intervalId = null;
    this.startTime = new Date();
    this.bestTime = Infinity;

    this._setPhase = this._setPhase.bind(this);
    this._getPhase = this._getPhase.bind(this);
    this._startTailing = this._startTailing.bind(this);
    this._triggerCaller = this._triggerCaller.bind(this);
    this._tailHandler = this._tailHandler.bind(this);
    this._updateTime = this._updateTime.bind(this);

    this._startTailing(this.logPath);
  }

  _setPhase(newPhase) {
    this.runPhase = newPhase;
  }

  _getPhase() {
    return this.runPhase;
  }

  _tailHandler(line) {
    const logEntries = shapeLog(line);
    if (logEntries.length > 0) {
      logEntries.forEach(logEntry => {
        const room = roomIdentifier(logEntry);
        const izaro = izaroQuote(logEntry);
        if (izaro) {
          this.lastIzaroQuoteEntry = logEntry;
        }
        switch (this._getPhase()) { // Check next phase
          case 'standby':
            if (plazaIdentifier(logEntry)) {
              this._setPhase('ready');
            }
            break;
          case 'ready':
            if (izaro) {
              this.startTime = logEntry.timestamp;
              this.intervalId = setInterval(this._updateTime, 340);
              this._setPhase('running');
            }
            break;
          case 'running':
            if (slainIdentifier(logEntry)) {
              this._setPhase('standby');
              clearInterval(this.intervalId);
              this.intervalId = null;
              break;
            }
            if (izaro && izaroFinalDialogue.includes(izaro)) {
              this._setPhase('standby');
              clearInterval(this.intervalId);
              this.intervalId = null;
              this._updateTime(logEntry.timestamp);
            }
            break;
          case 'room':
          default:
            console.log('please help')
        }
        if (leftLabyrinth(logEntry) && this._getPhase() !== 'standby') {
          this._setPhase('standby');
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
    document.getElementById('timer').textContent = secondsToMinutes(seconds);
    if (manualTime) {
      this.bestTime = Math.min(seconds, this.bestTime);
      document.getElementById('best').textContent = secondsToMinutes(this.bestTime);
    }
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