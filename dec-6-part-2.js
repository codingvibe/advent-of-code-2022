import { open } from "node:fs/promises";

async function getInput(filename) {
  const file = await open(filename);
  const fileContents = await file.readFile();
  await file.close();
  return fileContents.toString().split("\r\n");
}

async function process() {
  const allLines = await getInput('./inputData.txt');

  const uniqueCharacterLength = 14;
  const curCharacterCount = {};
  for (const line of allLines) {
    for (let i = 0; i < line.length; i++) {
      // add to list
      if (!(line[i] in curCharacterCount)) {
        curCharacterCount[line[i]] = 0;
      }
      curCharacterCount[line[i]]++;
      if(i > uniqueCharacterLength - 2){
        if (i > uniqueCharacterLength -1) {
          curCharacterCount[line[i - uniqueCharacterLength]]--;
        }
        let unique = true;
        for (let j = i - uniqueCharacterLength; j <= i; j++) {
          unique = unique && (curCharacterCount[line[j]] == 1)
        }
        if (unique) {
          return i+1;
        }
      }
    }
  }
}

console.log(await process());