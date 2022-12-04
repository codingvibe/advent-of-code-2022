import { open } from 'node:fs/promises';

async function getInput(filename) {
  const file = await open(filename);
  const fileContents = await file.readFile();
  file.close();
  return fileContents.toString().split('\r\n');
}

function findBadge(line1, line2, line3) {
  const items = {};
  for (let i = 0; i < line1.length; i++) {
    if (items[line1[i]] === undefined) {
      items[line1[i]] = [1]
    }
  }
  for (let i = 0; i < line2.length; i++) {
    if (items[line2[i]]) {
      if (items[line2[i]].length === 1) {
        items[line2[i]].push(1);
      }
    }
  }
  for (let i = 0; i < line3.length; i++) {
    if (items[line3[i]]) {
      if (items[line3[i]].length === 2) {
        items[line3[i]].push(1);
      }
    }
  }

  for(const item of Object.keys(items)) {
    if (items[item] && items[item].length === 3){
      return item;
    }
  }
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
  let badges = [];
  for (let i = 0; i < allLines.length; i += 3) {
    badges.push(findBadge(allLines[i], allLines[i+1], allLines[i+2]));
  }
  let totalScore = 0;
  for (const badge of badges) {
    totalScore = totalScore + toPriority(badge);
  }
  return totalScore
}

console.log(await process());