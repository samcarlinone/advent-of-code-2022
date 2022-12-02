const inputString = document.querySelector('pre').innerText.trim();

const itemScore = {
  X: 1,
  Y: 2,
  Z: 3,
};

const opponentItemMap = {
  A: 'X',
  B: 'Y',
  C: 'Z',
};

const winsAgainst = {
  X: 'Z',
  Y: 'X',
  Z: 'Y',
};

const losesAgainst = Object.fromEntries(Object.entries(winsAgainst).map(([k, v]) => [v, k]));

const scoreWithFn = fn => inputString
  .split('\n')
  .map(line => fn(...line.split(' ')))
  .reduce((t, s) => t + s)

// Part 1
const part1 = (opponentItem, item) => {
  const otherItem = opponentItemMap[opponentItem];

  const roundResult = item === otherItem ? 3 : (
    winsAgainst[item] === otherItem ? 6 : 0
  );

  return itemScore[item] + roundResult;
};

console.log('Part 1 score', scoreWithFn(part1));

// Part 2
const outcomeScore = {
  X: 0,
  Y: 3,
  Z: 6,
};

const part2 = (opponentItem, outcome) => {
  let playedItem = opponentItemMap[opponentItem];

  if (outcome === 'X') playedItem = winsAgainst[playedItem];
  if (outcome === 'Z') playedItem = losesAgainst[playedItem];

  return itemScore[playedItem] + outcomeScore[outcome];
}

console.log('Part 2 score', scoreWithFn(part2));
