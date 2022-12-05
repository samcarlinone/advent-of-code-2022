const inputString = document.querySelector('pre').innerText.trim(); 

const [initialStateString, instructionsListString] = inputString.split('\n\n');

const initialStateLines = initialStateString.split('\n');
const stackStrings = initialStateLines.slice(0, -1);
const columnsString = initialStateLines.slice(-1)[0];

// [{id: number, index: number}, ...]
const columnDefs = [...columnsString.matchAll(/(\d+)/g)].map((match) => ({id: +match[0], index: match.index}));

// Initialze column stacks (add 1 for 1-index)
const part1Cols = new Array(columnDefs.reduce((max, col) => Math.max(max, col.id), 0) + 1).fill(0).map(() => []);

// Populate stacks
for (let i = stackStrings.length - 1; i >= 0; i--) {
  columnDefs.forEach(({id, index}) => {
    const item = stackStrings[i][index];

    if (item && item !== ' ') part1Cols[id].push(stackStrings[i][index]);
  });
}

const part2Cols = part1Cols.map(col => col.slice());

const part1Move = (count, startId, endId) =>
  part1Cols[endId].push(...part1Cols[startId].splice(-count, count).reverse());

const part2Move = (count, startId, endId) =>
  part2Cols[endId].push(...part2Cols[startId].splice(-count, count));

const lineRegex = /move (\d+) from (\d+) to (\d+)/;

instructionsListString.split('\n').forEach(line => {
  const instructions = lineRegex.exec(line).slice(1);

  part1Move(...instructions);
  part2Move(...instructions);
});

console.log('Top element of each stack (pt. 1)', part1Cols.slice(1).map(col => col[col.length - 1] ?? '_').join(''));

console.log('Top element of each stack (pt. 2)', part2Cols.slice(1).map(col => col[col.length - 1] ?? '_').join(''));
