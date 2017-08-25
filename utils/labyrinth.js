const START_STRING = '] : You have entered Aspirants\' Plaza.';
const ENTERING_AREA = '] : You have entered ';
const IZARO_DIALOGUE = '] Izaro: ';
const izaroFinalDialogue = [
  'Triumphant at last!',
  'I die for the Empire!',
  'The trap of tyranny is inescapable.'
]
const leavingLabyrinth = [
  '] : You have entered Highgate.',
  '] : You have entered The Forest Encampment.',
  '] : You have entered The Sarn Encampment.',
  '] : You have entered Highgate.',
  '] : You have entered Highgate.',
]

const plazaIdentifier = (logEntry) => {
  return logEntry.entry.includes(START_STRING);
}

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

const leftLabyrinth = (logEntry) => {
  return leavingLabyrinth.some(town => logEntry.entry.includes(town));
}

module.exports = {
  plazaIdentifier,
  roomIdentifier,
  izaroQuote,
  izaroFinalDialogue,
  leftLabyrinth,
}
