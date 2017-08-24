// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const Tail = require('always-tail');

const {
  promiseTimeout,
  shapeLog,
} = require('./utils');
const { getLog } = require('./utils/fs');
const { roomIdentifier } = require('./utils/labyrinth');
const LabyrinthRun = require('./classes/labyrinth-run');

const poeLogPath = '../../Games/PathOfExile/logs/Client.txt';
// const poeLogPath = './example_lab_run.txt';

const labRun = new LabyrinthRun();

labRun.on('directions-loaded', () => {
  document.getElementById('previous').textContent = JSON.stringify(labRun.directions);
});

labRun.on('current-direction-changed', () => {
  document.getElementById('current-room').textContent = labRun.currentDirection;
  document.getElementById('next-room').textContent = labRun.nextDirection;
})

// const updatePoeLog = async () => {
//   const poeLog = await getLog(poeLogPath);
//   poeLog.forEach(entry => {
//     const logEntry = document.createElement('div');
//     logEntry.textContent = entry.timestamp;
//     document.getElementById('fullLog')
//       .appendChild(logEntry);
//   })
// }

// const tailHandler = (line) => {
//   const logEntries = shapeLog(line);
//   if (logEntries.length > 0) {
//     logEntries.forEach(logEntry => {
//       const room = roomIdentifier(logEntry);
//       if (room) {
//         const previousDiv = document.getElementById('previous');
//         const a = document.createElement('div');
//         a.textContent = room;
//         previousDiv.appendChild(a);
//       }
//     });
//   }
// }

// const poeTail = new Tail(poeLogPath);

// poeTail.on('line', tailHandler);
