// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const {
  promiseTimeout,
  shapeLog,
} = require('./utils');
const {readPromise } = require('./utils/fs');
const { uninterestingText } = require('./resources');

// const poeLogPath = '../../Games/PathOfExile/logs/Client.txt';
const poeLogPath = './example_lab_run.txt';

const updatePoeLog = async () => {
  const poeLogRaw = await readPromise(poeLogPath);
  const poeLog = shapeLog(poeLogRaw);
  poeLog.forEach(entry => {
    const logEntry = document.createElement('div');
    logEntry.textContent = entry;
    document.getElementById('fullLog')
      .appendChild(logEntry);
  })
}

updatePoeLog();

const a = async () => {
  for (let i = 0; i < 100; i++) {
    const counterField = document.getElementById('counter').textContent = i;
    await promiseTimeout(1000);
  }
};

a();
