const inputString = document.querySelector('pre').innerText.trim();

const generateOperation = operationStr => {
  const numberMatch = /(\d+)/.exec(operationStr)?.[1];

  if (numberMatch === undefined) return n => n ** 2;

  const operand = Number(numberMatch);

  if (operationStr.indexOf('+') !== -1) return n => n + operand;

  if (operationStr.indexOf('*') !== -1) return n => n * operand;
  
  throw new Error('Unrecongnized operation');
}

const parseMonkey = str => {
  const items = /Starting items: (.*)$/m;
  const operation = /Operation: new = (.*)$/m;
  const test = /Test: divisible by (?<modBy>\d+).*?monkey (?<trueMonkey>\d+).*?monkey (?<falseMonkey>\d+)/s;

  const {modBy, trueMonkey, falseMonkey} = test.exec(str).groups;

  return {
    items: items.exec(str)[1].split(', ').map(n => Number(n)),
    operation: generateOperation(operation.exec(str)[1]),
    test: {
      modBy: Number(modBy),
      trueMonkey: Number(trueMonkey),
      falseMonkey: Number(falseMonkey),
    },
    inspectionCount: 0,
  }
};

const runSimulation = isPart1 => {
  const monkeys = inputString.split('\n\n').map(parseMonkey);

  // Link monkeys
  monkeys.forEach(m => {
    m.test.trueMonkey = monkeys[m.test.trueMonkey];
    m.test.falseMonkey = monkeys[m.test.falseMonkey];
  });

  // We only care about how the values can be factored
  // To keep numbers manageable we will mod by the product of all relevant factors
  const numericSpace = monkeys.map(m => m.test.modBy).reduce((t, c) => t * c);

  const roundCount = isPart1 ? 20 : 10_000;

  for (let round = 0; round < roundCount; round++) {
    for (let m = 0; m < monkeys.length; m++) {
      const monkey = monkeys[m];

      while (monkey.items.length) {
        const val = isPart1
          ? Math.floor(monkey.operation(monkey.items.shift()) / 3)
          : monkey.operation(monkey.items.shift()) % numericSpace;

        if (val % monkey.test.modBy === 0) {
          monkey.test.trueMonkey.items.push(val);
        } else {
          monkey.test.falseMonkey.items.push(val);
        }

        monkey.inspectionCount++;
      }
    }
  }

  return monkeys
    .map(m => m.inspectionCount)
    .sort((a, b) => b - a)
    .slice(0, 2)
    .reduce((t, c) => t * c);
}

console.log('Part 1: ', runSimulation(true));
console.log('Part 2: ', runSimulation(false));
