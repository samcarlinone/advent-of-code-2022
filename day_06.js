const inputString = document.querySelector('pre').innerText.trim();

const findCharsBeforePacket = (str, size) => {
  const buffer = [];

  for (let i = 0; i < str.length; i++) {
    if (buffer.length === size) buffer.shift();

    buffer.push(str[i]);

    const uniq = new Set(buffer);

    if (uniq.size === size) return i + 1;
  }

  return -1;
}

console.log('First packet found after ', findCharsBeforePacket(inputString, 4));

console.log('First message found after ', findCharsBeforePacket(inputString, 14));
