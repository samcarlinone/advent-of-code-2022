const inputString = document.querySelector('pre').innerText.trim();

const simulateRope = ropeLength => {
  const visited = new Set();

  const ropeX = new Int32Array(ropeLength);
  const ropeY = new Int32Array(ropeLength);

  inputString.split('\n').forEach(line => {
    const [_, direction, distance] = /(\w) (\d+)/.exec(line);
  
    for (let c = 0; c < distance; c++) {
      if (direction === 'U') ropeY[0] += 1;
      if (direction === 'D') ropeY[0] -= 1;
  
      if (direction === 'L') ropeX[0] -= 1;
      if (direction === 'R') ropeX[0] += 1;
  
      for (let i = 1; i < ropeLength; i++) {
        if (Math.abs(ropeX[i - 1] - ropeX[i]) > 1 || Math.abs(ropeY[i - 1] - ropeY[i]) > 1) {
          ropeX[i] += Math.sign(ropeX[i - 1] - ropeX[i]);
          ropeY[i] += Math.sign(ropeY[i - 1] - ropeY[i]);
        }
      }

      visited.add(`${ropeX[ropeLength - 1]}-${ropeY[ropeLength - 1]}`);
    }
  });

  return visited;
}

console.log('Unique locations visited (2): ', simulateRope(2).size);

console.log('Unique locations visited (10): ', simulateRope(10).size);
