// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const electron = require('electron');
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

const bodyElement = document.getElementById('body');
const containerElement = document.getElementById('container');

const makeTransparencyListener = () => {
  containerElement.addEventListener('mouseover', (e) => {
    bodyElement.classList.add('transparent');
    electron.ipcRenderer.send('mouseIn', true);
  });
}

const replaceImage = (e) => {
  e.preventDefault();
  const newUrl = document.getElementById('url_input').value;
  document.getElementById('lab_map').src = newUrl;
  document.getElementById('lab_map').classList.remove('hidden');
  document.getElementById('url_form').classList.add('hidden');

  // Transparency logic.
  makeTransparencyListener();
  return false;
}

const openPoelabLink = (e) => {
  electron.shell.openExternal('http://www.poelab.com');
}

document.getElementById('url_form').addEventListener('submit', replaceImage);
document.getElementById('poelab_link').addEventListener('click', openPoelabLink);
// document.getElementById('url_button').addEventListener('click', replaceImage)

readPromise('./config.json').then(a => {
  const config = JSON.parse(a);
  const labRun = new LabyrinthRun(config.logPath || poeLogPath);

  // Transparency logic
  electron.ipcRenderer.on('mouseOut', () => {
    bodyElement.classList.remove('transparent');
    // makeTransparencyListener();
  });
});
