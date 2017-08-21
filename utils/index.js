const { uninterestingText } = require('../resources');

const promiseTimeout = (delay) => new Promise(resolve => setTimeout(resolve, delay));

const splitLines = (string) => string.match(/[^\r\n]+/g);

const filterStrings = (stringArray, badStrings) => stringArray.filter((string) => !badStrings.some((badString) => string.includes(badString)));

const shapeLog = (poeLogRaw) => {
  const log = filterStrings(splitLines(poeLogRaw), uninterestingText).map(entry => {
    const entryWords = entry.match(/[^ ]+/g);
    const timestamp =  new Date(`${entryWords[0]} ${entryWords[1]}`);
    return {
      timestamp,
      entry,
    }
  });
  return log;
}

module.exports = {
  promiseTimeout,
  splitLines,
  filterStrings,
  shapeLog,
}
