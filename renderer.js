// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const {
  promiseTimeout,
} = require('./utils');
const { getLog } = require('./utils/fs');

// const poeLogPath = '../../Games/PathOfExile/logs/Client.txt';
const poeLogPath = './example_lab_run.txt';

let latestRun = []; // Can't think of a functional way to store the run state right now.

const updatePoeLog = async () => {
  const poeLog = await getLog(poeLogPath);
  poeLog.forEach(entry => {
    const logEntry = document.createElement('div');
    logEntry.textContent = entry.timestamp;
    document.getElementById('fullLog')
      .appendChild(logEntry);
  })
}

updatePoeLog();

const mainLoop = async () => {
  for (let i = 0; i < 100; i++) {
    const counterField = document.getElementById('counter').textContent = i;
    await promiseTimeout(1000);
  }
};

mainLoop();
