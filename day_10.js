const inputString = document.querySelector('pre').innerText.trim();

const addXInstruction = /addx (-?\d+)/;

const sampleCycles = [20, 60, 100, 140, 180, 220];
let sampleSum = 0;

const CRT_WIDTH = 40;
const CRT_HEIGHT = 6;
const crtBuffer = [];

let cycle = 0;
let x = 1;

const instructionBuffer = inputString.split('\n').map(line => {
  const match = addXInstruction.exec(line);

  if (!match) return 'noop';

  return ['addx', Number(match[1])];
}).flat(1);

while (instructionBuffer.length > 0) {
  const inst = instructionBuffer.shift();

  cycle++;

  if (sampleCycles.includes(cycle)) sampleSum += x * cycle;

  const crtCycle = (cycle - 1) % CRT_WIDTH;

  crtBuffer.push(Math.abs(crtCycle - x) <= 1 ? '#' : ' ');

  if (crtCycle === CRT_WIDTH - 1) crtBuffer.push('\n');

  if (typeof inst === 'number') x += inst;
}

console.log('Sum of samples: ', sampleSum);

console.log(crtBuffer.join(''));
