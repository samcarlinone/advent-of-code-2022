const inputString = document.querySelector('pre').innerText.trim();

const grid = inputString.split('\n')
  .map(line => line.split('').map(n => Number(n)));

const visibleGrid = grid.map(row => row.slice().map(_ => 0));

for (let row = 0; row < grid.length; row++) {
  let tallest = -1;

  for (let col = 0; col < grid[row].length; col++) {
    if (grid[row][col] > tallest) {
      visibleGrid[row][col] = 1;
      tallest = grid[row][col];

      // Each tree is one digit from 0-9
      if (tallest === 9) break;
    }
  }

  tallest = -1;

  for (let col = grid[row].length - 1; col >= 0; col--) {
    if (grid[row][col] > tallest) {
      visibleGrid[row][col] = 1;
      tallest = grid[row][col];

      if (tallest === 9) break;
    }
  }
}

for (let col = 0; col < grid[0].length; col++) {
  let tallest = -1;

  for (let row = 0; row < grid.length; row++) {
    if (grid[row][col] > tallest) {
      visibleGrid[row][col] = 1;
      tallest = grid[row][col];

      if (tallest === 9) break;
    }
  }

  tallest = -1;

  for (let row = grid.length - 1; row >= 0; row--) {
    if (grid[row][col] > tallest) {
      visibleGrid[row][col] = 1;
      tallest = grid[row][col];

      if (tallest === 9) break;
    }
  }
}

const visibleCount = visibleGrid
  .reduce((t, row) => t + row.reduce((c, v) => c + v), 0);

console.log('Total visible trees: ', visibleCount);

let bestViewScore = 0;

for (let row = 0; row < grid.length; row++) {
  for (let col = 0; col < grid[row].length; col++) {
    const visible = [0, 0, 0, 0];

    const treeHeight = grid[row][col];

    for (let lookRow = row - 1; lookRow >= 0; lookRow--) {
      visible[0]++;
      
      if (grid[lookRow][col] >= treeHeight) break;
    }

    for (let lookRow = row + 1; lookRow < grid.length; lookRow++) {
      visible[1]++;
      
      if (grid[lookRow][col] >= treeHeight) break;
    }

    for (let lookCol = col - 1; lookCol >= 0; lookCol--) {
      visible[2]++;
      
      if (grid[row][lookCol] >= treeHeight) break;
    }

    for (let lookCol = col + 1; lookCol < grid[row].length; lookCol++) {
      visible[3]++;
      
      if (grid[row][lookCol] >= treeHeight) break;
    }

    bestViewScore = Math.max(bestViewScore, visible.reduce((p, n) => p * n));
  }
}

console.log('Best scenic score: ', bestViewScore);
