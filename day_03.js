const inputString = document.querySelector('pre').innerText.trim();

const itemPriority = item =>
  /[A-Z]/.test(item) 
    ? item.charCodeAt(0) - 'A'.charCodeAt(0) + 27
    : item.charCodeAt(0) - 'a'.charCodeAt(0) + 1;

const lines = inputString.split('\n');

// Part 1
const bothCompartmentItems = lines
  .map(line => [line.slice(0, line.length / 2), line.slice(line.length / 2)])
  .map(([first, second]) => [...first].find(item => second.indexOf(item) !== -1));

const part1Sum = bothCompartmentItems.map(itemPriority).reduce((t, p) => t + p);

console.log('Priority sum part 1', part1Sum);

// Part 2
let part2Sum = 0;

for (let i = 0; i < lines.length; i += 3) {
  const otherPacks = [new Set(lines[i + 1]), new Set(lines[i + 2])];

  const badge = [...lines[i]].find(item => otherPacks.every(pack => pack.has(item)))

  part2Sum += itemPriority(badge);
}

console.log('Priority sum part 2', part2Sum);