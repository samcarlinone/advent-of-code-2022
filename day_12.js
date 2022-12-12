const inputString = document.querySelector('pre').innerText.trim();

const getCharHeight = s => s.charCodeAt(0) - 97;

const parseMap = str => {
  let grid = str.split('\n').map(line => line.split(''));

  const rowCount = grid.length;
  const colCount = grid[0].length;

  let startPos = null;
  let endPos = null;

  for (let row = 0; row < rowCount; row++) {
    for (let col = 0; col < colCount; col++) {
      if (grid[row][col] === 'S') {
        startPos = {row, col};
        grid[row][col] = getCharHeight('a');
        continue;
      }

      if (grid[row][col] === 'E') {
        endPos = {row, col};
        grid[row][col] = getCharHeight('z');
        continue;
      }

      grid[row][col] = getCharHeight(grid[row][col]);
    }
  }

  return {
    rowCount,
    colCount,
    startPos,
    endPos,
    grid,
  };
}

const findMinimumPaths = str => {
  const {rowCount, colCount, startPos, endPos, grid} = parseMap(str);

  const paths = [
    {row: endPos.row, col: endPos.col, length: 0},
  ];

  const distanceGrid = grid.map(row => row.map(_ => Number.MAX_SAFE_INTEGER));

  const isValidPosition = (row, col, path) =>   
    0 <= row && row < rowCount &&
    0 <= col && col < colCount &&
    grid[row][col] + 1 >= grid[path.row][path.col] &&
    distanceGrid[row][col] > path.length + 1;

  while (paths.length) {
    const path = paths.shift();

    distanceGrid[path.row][path.col] = path.length;

    if (isValidPosition(path.row - 1, path.col, path))
      paths.unshift({row: path.row - 1, col: path.col, length: path.length + 1});

    if (isValidPosition(path.row + 1, path.col, path))
      paths.unshift({row: path.row + 1, col: path.col, length: path.length + 1});

    if (isValidPosition(path.row, path.col - 1, path))
      paths.unshift({row: path.row, col: path.col - 1, length: path.length + 1});

    if (isValidPosition(path.row, path.col + 1, path))
      paths.unshift({row: path.row, col: path.col + 1, length: path.length + 1});
  }

  let toLowestElevation = Number.MAX_SAFE_INTEGER;

  for (let row = 0; row < rowCount; row++) {
    for (let col = 0; col < colCount; col++) {
      if (grid[row][col] === 0)
        toLowestElevation = Math.min(toLowestElevation, distanceGrid[row][col]);
    }
  }

  return {
    fromStart: distanceGrid[startPos.row][startPos.col],
    toLowestElevation,
  };
}

console.log('Shortest paths: ', findMinimumPaths(inputString));
