const X_PADDING = 150;

const inputString = (
  [...document.querySelectorAll('p')]?.find(n => /for example:/i.test(n.innerText))?.nextElementSibling?.innerText ??
  document.querySelector('pre').innerText
).trim();

const lines = inputString.split('\n')
  .map(line => line.split(' -> ')
    .map(coord => coord.split(',')
      .map(n => Number(n))
    )
  );

const coords = lines.flat(1).concat([[500, 0]]);

const xMin = coords.reduce((min, [x, _]) => Math.min(min, x), Number.MAX_SAFE_INTEGER) - X_PADDING;
const xMax = coords.reduce((max, [x, _]) => Math.max(max, x), Number.MIN_SAFE_INTEGER) + X_PADDING;
const yMin = coords.reduce((min, [_, y]) => Math.min(min, y), Number.MAX_SAFE_INTEGER);
const yMax = coords.reduce((max, [_, y]) => Math.max(max, y), Number.MIN_SAFE_INTEGER) + 1;

const div = document.createElement('div');

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

const canvasScale = 5;

const width = xMax - xMin + 1;
const height = yMax - yMin + 1;

canvas.width = width;
canvas.height = height;

ctx.width = width;
ctx.height = height;

div.style = `
position: fixed;
top: 16px;
left: 16px;
right: 16px;
overflow: scroll;
border: 2px solid red;
background: black;`;

canvas.style = `
width: ${width * canvasScale}px;
height: ${height * canvasScale}px;
image-rendering: pixelated;
image-rendering: crisp-edges;`;

div.appendChild(canvas)
document.body.appendChild(div);

const imageData = ctx.getImageData(0, 0, width, height);
const buffer = imageData.data;

const LINE_COLOR = new Uint8ClampedArray([255, 255, 255, 255]);
const EMPTY_COLOR = new Uint8ClampedArray([0, 0, 0, 0]);
const SAND_COLOR = new Uint8ClampedArray([177, 157, 94, 255]);

const getIndex = (x, y) => ((x - xMin) + (y - yMin) * width) * 4;

const writeColor = (x, y, color) => {
  for (let i = 0; i < 4; i++) {
    buffer[getIndex(x, y) + i] = color[i];
  }
};

const readColor = (x, y) => {
  return buffer.slice(getIndex(x, y), getIndex(x, y) + 4);
};

const equalsColor = (c1, c2) => {
  return c1.every((v, i) => c2[i] === v);
};

const writeLinesToBuffer = () => {
  lines.forEach(line => {
    let x = line[0][0];
    let y = line[0][1];
  
    writeColor(x, y, LINE_COLOR);
  
    line.slice(1).forEach(([targetX, targetY]) => {
      while (x !== targetX || y !== targetY) {
        x += Math.sign(targetX - x);
        y += Math.sign(targetY - y);
  
        writeColor(x, y, LINE_COLOR);
      }
    })
  });
  
}

writeLinesToBuffer();
ctx.putImageData(imageData, 0, 0);

const sand = [[500, 0]];

let simulationSpeed = 5_000;

const moveSandPt1 = () => {
  const currentSand = sand[sand.length - 1];

  if (currentSand[1] > yMax) return false;

  writeColor(currentSand[0], currentSand[1], EMPTY_COLOR);

  if (equalsColor(readColor(currentSand[0], currentSand[1] + 1), EMPTY_COLOR)) currentSand[1] += 1;
  else if (equalsColor(readColor(currentSand[0] - 1, currentSand[1] + 1), EMPTY_COLOR)) {currentSand[0] -= 1; currentSand[1] += 1;}
  else if (equalsColor(readColor(currentSand[0] + 1, currentSand[1] + 1), EMPTY_COLOR)) {currentSand[0] += 1; currentSand[1] += 1;}
  else sand.push([500, 0]);

  writeColor(currentSand[0], currentSand[1], SAND_COLOR);

  return true;
}

const moveSandPt2 = () => {
  const currentSand = sand[sand.length - 1];

  writeColor(currentSand[0], currentSand[1], EMPTY_COLOR);

  if (currentSand[1] === yMax) sand.push([500, 0]);
  else if (equalsColor(readColor(currentSand[0], currentSand[1] + 1), EMPTY_COLOR)) currentSand[1] += 1;
  else if (equalsColor(readColor(currentSand[0] - 1, currentSand[1] + 1), EMPTY_COLOR)) {currentSand[0] -= 1; currentSand[1] += 1;}
  else if (equalsColor(readColor(currentSand[0] + 1, currentSand[1] + 1), EMPTY_COLOR)) {currentSand[0] += 1; currentSand[1] += 1;}
  else if (currentSand[1] === 0) return false;
  else sand.push([500, 0]);

  writeColor(currentSand[0], currentSand[1], SAND_COLOR);

  return true;
}

const runSimulation = () => {
  for (let i = 0; i < simulationSpeed; i++) {
    if (!moveSandPt2()) return console.log('Filled with this much sand: ', sand.length);
  }

  ctx.putImageData(imageData, 0, 0);

  window.requestAnimationFrame(runSimulation);
}

window.requestAnimationFrame(runSimulation);
