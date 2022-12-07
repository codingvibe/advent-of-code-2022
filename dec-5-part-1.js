import { open } from 'node:fs/promises';

async function getInput(filename) {
  const file = await open(filename);
  const fileContents = await file.readFile();
  file.close();
  return fileContents.toString().split('\r\n');
}

async function process() {
  const allLines = await getInput('./inputData.txt');
  const columnNumbersRegex = /^(\s*\d\s*)+\n*$/;
  let columnLineNum = -1;
  let numColumns = -1;
  // Find number of columns and line where column num is
  for (let i = 0; i < allLines.length; i++) {
    if (columnNumbersRegex.test(allLines[i])) {
      columnLineNum = i;
      numColumns = parseInt(allLines[i][allLines[i].length-2])
    }
  }

  const crates = [];
  // Set up 2D array
  for (let i = 0; i < numColumns; i++) {
    crates.push([]);
  }

  // Put crates in 2D array
  for (let i = 0; i < columnLineNum; i++) {
    for (let j = 0; j < allLines[i].length; j += 4) {
      const crateVal = allLines[i].substring(j+1,j+2);
      if (crateVal != " ") {
        crates[j/4].push(crateVal)
      }
    }
  }

  const movesRegex = /^move\s+(\d+)\s+from\s+(\d+)\s+to\s+(\d+)\s*$/;
  // Process moves
  for (let i = columnLineNum + 2; i < allLines.length; i++) {
    const matches = movesRegex.exec(allLines[i]);
    const moveNum = parseInt(matches[1]);
    const fromCol = parseInt(matches[2]) - 1;
    const toCol = parseInt(matches[3]) - 1;
    for (let j = 0; j < moveNum; j++) {
      if (crates[fromCol].length > 0) {
        const crate = crates[fromCol].shift();
        crates[toCol].unshift(crate);
      }
    }
  }

  const topCrates = [];
  crates.forEach(column => topCrates.push(column[0]));
  return topCrates.join("")
}

console.log(await process());