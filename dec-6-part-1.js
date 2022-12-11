import { open } from "node:fs/promises";

async function getInput(filename) {
  const file = await open(filename);
  const fileContents = await file.readFile();
  await file.close();
  return fileContents.toString().split("\r\n");
}

async function process() {
  const allLines = await getInput('./inputData.txt');

  const curCharacterCount = {};
  for (const line of allLines) {
    for (let i = 0; i < line.length; i++) {
      // add to list
      if (!(line[i] in curCharacterCount)) {
        curCharacterCount[line[i]] = 0;
      }
      curCharacterCount[line[i]]++;
      if (i > 2) {
        if (i > 3) {
          curCharacterCount[line[i-4]]--;
        }
        if (curCharacterCount[line[i]] == 1 &&
          curCharacterCount[line[i-1]] == 1 &&
          curCharacterCount[line[i-2]] == 1 &&
          curCharacterCount[line[i-3]] == 1) {
            return i+1;
        }
      }
    }
  }
}

console.log(await process());