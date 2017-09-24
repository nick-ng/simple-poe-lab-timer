const START_STRING = '] : You have entered Aspirants\' Plaza.';
const ENTERING_AREA = '] : You have entered ';
const IZARO_DIALOGUE = '] Izaro: ';
const izaroFinalDialogue = [
  'Triumphant at last!',
  'I die for the Empire!',
  'The trap of tyranny is inescapable.'
]
const leavingLabyrinthRegex = [
  /] : You have entered.*Hideout\.$/, // Match any hideout
  /] : You have entered Lioneye's Watch\.$/, // Act 1 & 6
  /] : You have entered The Forest Encampment\.$/, // Act 2
  /] : You have entered The Sarn Encampment\.$/, // Act 3 & 8
  /] : You have entered Highgate\.$/, // Act 4 & 9
  /] : You have entered Overseer's Tower\.$/, // Act 5
  /] : You have entered The Bridge Encampment\.$/, // Act 7
  /] : You have entered Oriath Docks\.$/, // Act 10
  /] : You have entered Oriath\.$/, // Epilogue
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
  return leavingLabyrinthRegex.some(placeRegex => logEntry.entry.match(placeRegex));
}

module.exports = {
  plazaIdentifier,
  roomIdentifier,
  izaroQuote,
  izaroFinalDialogue,
  leftLabyrinth,
}
