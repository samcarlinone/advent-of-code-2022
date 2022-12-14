// Dynamically selects for description or input page (assuming he keeps labeling the example input "for example")
const inputString = (
  [...document.querySelectorAll('p')]?.find(n => /for example:/i.test(n.innerText))?.nextElementSibling?.innerText ??
  document.querySelector('pre').innerText
).trim();

const isPairInOrder = (left, right) => {
  if (typeof left === 'number' && typeof right === 'number') {
    if (left < right) return true;
    if (left > right) return false;

    return null;
  }

  if (typeof left === 'number') return isPairInOrder([left], right);
  if (typeof right === 'number') return isPairInOrder(left, [right]);

  for (let i = 0; i < Math.min(left.length, right.length); i++) {
    const itemResult = isPairInOrder(left[i], right[i]);

    if (itemResult !== null) return itemResult;
  }

  if (left.length < right.length) return true;
  if (left.length > right.length) return false;

  return null; 
}

// Part 1
const inOrderIndexes = inputString.split('\n\n')
  .map((line, index) => isPairInOrder(...line.split('\n').map(p => JSON.parse(p))) ? index + 1 : 0);

console.log('Sum of valid indexes: ', inOrderIndexes.reduce((t, i) => t + i));

// Part 2
const dividerPackets = [
  '[[2]]',
  '[[6]]',
];

const orderedPackets = `${inputString}
${dividerPackets.join('\n')}`
  .split('\n')
  .filter(s => s)
  .map(p => JSON.parse(p))
  .sort((a, b) => {
    const order = isPairInOrder(a, b);

    if (order === null) return 0;

    return order ? -1 : 1;
  });

const dividerIndexProduct = orderedPackets
  .map(p => JSON.stringify(p))
  .map((s, index) => dividerPackets.includes(s) ? index + 1 : 1)
  .reduce((p, i) => p * i);

console.log('Product of divider packet indices: ', dividerIndexProduct);
