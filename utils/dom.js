const makeSmallDirection = (direction, correctPath = false) => {
  const smallDirection = document.createElement('div');
  if (correctPath) {
    smallDirection.className = `small_direction direction${direction} correct`;
  } else {
    smallDirection.className = `small_direction direction${direction}`;
  }
  return smallDirection;
}

const makeDirections = (directions, correctPath = false) => {
  if (isNaN(directions[0])) {
    const textNode = document.createElement('div');
    textNode.classList = 'direction_text';
    textNode.textContent = directions;
    return textNode;
  }
  const directionIndicator = document.createElement('div');
  directionIndicator.className = 'direction_indicator';
  directionIndicator.appendChild(makeSmallDirection(directions[0], true));
  for (let i = 1; i < directions.length; i++) {
    directionIndicator.appendChild(makeSmallDirection(directions[i]));
  }
  return directionIndicator;
}

const emptyElement = (element) => {
  while (element.lastChild) {
    element.removeChild(element.lastChild);
  }
}

module.exports = {
  makeDirections,
  emptyElement,
};
