// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const Tail = require('always-tail');

const {
  promiseTimeout,
  shapeLog,
} = require('./utils');
const { readPromise, getLog } = require('./utils/fs');
const { roomIdentifier } = require('./utils/labyrinth');
const { makeDirections, emptyElement } = require('./utils/dom');
const LabyrinthRun = require('./classes/labyrinth-run');

const poeLogPath = '../../Games/Path Of Exile/logs/Client.txt';
// const poeLogPath = './example_lab_run.txt';

readPromise('./config.json').then(a => {
  const config = JSON.parse(a);
  const labRun = new LabyrinthRun(config.logPath || poeLogPath);
  
  labRun.on('current-direction-changed', () => {
    emptyElement(document.getElementById('current-room'));
    document.getElementById('current-room')
      .appendChild(makeDirections(labRun.currentDirection));
    emptyElement(document.getElementById('next-room'));
    document.getElementById('next-room')
      .appendChild(makeDirections(labRun.nextDirection));
  });
});
