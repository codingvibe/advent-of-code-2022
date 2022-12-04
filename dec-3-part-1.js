import { open } from 'node:fs/promises';

async function getInput(filename) {
  const file = await open(filename);
  const fileContents = await file.readFile();
  file.close();
  return fileContents.toString().split('\r\n');
}

function getDuplicates(line) {
  const half = line.length / 2;
  const items = {};
  for (let i = 0; i < half; i++) {
    items[line[i]] = true;
  }
  const dupes = [];
  for (let j = half; j < line.length; j++) {
    if (items[line[j]]) {
      items[line[j]] = false;
      dupes.push(line[j])
    }
  }
  return dupes
}

function toPriority(item) {
  if (item.charCodeAt() > 96) {
    return item.charCodeAt() - 96;
  } else {
    return item.charCodeAt() - 64 + 26;
  }
}

async function process() {
  const allLines = await getInput('./inputData.txt');
  let dupes = [];
  for (const line of allLines) {
    dupes = dupes.concat(getDuplicates(line));
  }
  let totalScore = 0;
  for (const item of dupes) {
    totalScore = totalScore + toPriority(item);
  }
  return totalScore
}

console.log(await process());