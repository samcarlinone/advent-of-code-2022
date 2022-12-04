const inputString = document.querySelector('pre').innerText.trim(); 

const rangeRegex = /(\d+)-(\d+),(\d+)-(\d+)/;

const rangesList = inputString.split('\n')
  .map(line => {
    const [_, r1Lo, r1Hi, r2Lo, r2Hi] = rangeRegex.exec(line);

    return [[+r1Lo, +r1Hi], [+r2Lo, +r2Hi]];
  });

// Part 1
const rangeContains = ([r1Lo, r1Hi], [r2Lo, r2Hi]) =>
  (r1Lo <= r2Lo && r2Hi <= r1Hi) ||
  (r2Lo <= r1Lo && r1Hi <= r2Hi);

const containedRanges = rangesList.filter(ranges => rangeContains(...ranges)).length;

console.log('Contained ranges count is', containedRanges);

// Part 2
const rangeOverlaps = ([r1Lo, r1Hi], [r2Lo, r2Hi]) =>
  (r1Lo <= r2Lo && r2Lo <= r1Hi) || // Is either endpoint of r2 in r1
  (r1Lo <= r2Hi && r2Hi <= r1Hi) ||
  (r2Lo <= r1Lo && r1Hi <= r2Hi);   // Or is r1 contained in r2

const overlappingRanges = rangesList.filter(ranges => rangeOverlaps(...ranges)).length;

console.log('Overlapping ranges count is', overlappingRanges);
