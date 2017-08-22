const START_STRING = '] : You have entered Aspirants\' Plaza.';
const ENTERING_AREA = '] : You have entered ';
const IZARO_DIALOGUE = '] Izaro: ';
const izaroFinalDialogue = [
  '] Izaro: Triumphant at last!',
]
const leavingLabyrinth = [
  '] : You have entered Highgate.',
]

const roomIdentifier = (logEntry) => {
  if (logEntry.entry.includes(ENTERING_AREA)) {
    return logEntry.entry.replace(/^.*(] : You have entered )/g, '').replace('.', '');
  }
  return false;
};

const izaroQuote = (logEntry) => {
  if (logEntry.entry.includes(IZARO_DIALOGUE)) {
    return logEntry.entry.replace(/^.*(] Izaro: )/g, '');
  }
  return false;
};

module.exports = {
  roomIdentifier,
  izaroQuote,
}
