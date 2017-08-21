const { uninterestingText } = require('../resources');

const promiseTimeout = (delay) => new Promise(resolve => setTimeout(resolve, delay));

const splitLines = (string) => string.match(/[^\r\n]+/g);

const filterStrings = (stringArray, badStrings) => stringArray.filter((string) => !badStrings.some((badString) => string.includes(badString)));

const shapeLog = (poeLogRaw) => {
  const poeLog = filterStrings(splitLines(poeLogRaw), uninterestingText);
}

module.exports = {
  promiseTimeout,
  splitLines,
  filterStrings,
  shapeLog,
}
