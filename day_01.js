const inputString = document.querySelector('pre').innerText.trim();

const elfStrings = inputString.split('\n\n');

const elfCalories = elfStrings.map(s => 
  s.split('\n')
    .map(n => +n)
    .reduce((t, n) => t + n),
);

const caloriesDesc = elfCalories.sort((a, b) => b - a);

const nMostCals = n => caloriesDesc.slice(0, n).reduce((t, c) => t + c);

console.log(`Top calories ${nMostCals(1)}`);
console.log(`Top 3 calories sum ${nMostCals(3)}`);
