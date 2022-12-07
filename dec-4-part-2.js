import { open } from 'node:fs/promises';

async function getInput(filename) {
  const file = await open(filename);
  const fileContents = await file.readFile();
  file.close();
  return fileContents.toString().split('\r\n');
}

function splitBound(input) {
  const bounds = input.split('-');
  return [parseInt(bounds[0]), parseInt(bounds[1])]
}

function isPairSuperset(line) {
  const pair = line.split(',');
  const firstBounds = splitBound(pair[0]);
  const secondBounds = splitBound(pair[1]);

  return (firstBounds[0] <= secondBounds[0] && firstBounds[1] >= secondBounds[1]) ||
        (secondBounds[0] <= firstBounds[0] && secondBounds[1] >= firstBounds[1]) ||
        (firstBounds[1] >= secondBounds[0] && firstBounds[1] <= secondBounds[1]) ||
        (secondBounds[1] >= firstBounds[0] && secondBounds[1] <= firstBounds[1])
}

async function process() {
  let total = 0;
  const allLines = await getInput('./inputData.txt');

  for (const line of allLines) {
    if (isPairSuperset(line)) {
      total++;
    }
  }
  return total;
}

console.log(await process());