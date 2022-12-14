import { open } from "node:fs/promises";

async function getInput(filename) {
  const file = await open(filename);
  const fileContents = await file.readFile();
  await file.close();
  return fileContents.toString().split("\r\n");
}

async function process() {
  const trees = await getInput("./inputData.txt");
  const leftRowVis = [];
  const rightRowVis = [];
  for (let i = 0; i < trees.length; i++) {
    let curMax = -1;
    leftRowVis.push([]);
    rightRowVis.push([]);
    for (let j = 0; j < trees[i].length; j++) {
      const height = parseInt(trees[i][j]);
      leftRowVis[i].push(height > curMax);
      if (height > curMax) {
        curMax = height;
      }
    }
    curMax = -1;
    for (let j = trees[i].length-1; j >=0 ; j--) {
      const height = parseInt(trees[i][j]);
      rightRowVis[i].unshift(height > curMax);
      if (height > curMax) {
        curMax = height;
      }
    }
  }
  const upColVis = [];
  const downColVis = [];
  for (let i = 0; i < trees.length; i++) {
    let curMax = -1;
    downColVis.push([]);
    upColVis.push([]);
    for (let j = 0; j < trees[i].length; j++) {
      const height = parseInt(trees[j][i]);
      downColVis[i].push(height > curMax);
      if (height > curMax) {
        curMax = height;
      }
    }
    curMax = -1;
    for (let j = trees.length-1; j >=0 ; j--) {
      const height = parseInt(trees[j][i]);
      upColVis[i].unshift(height > curMax);
      if (height > curMax) {
        curMax = height;
      }
    }
  }
  let totalVisible = 0;
  for (let i = 0; i < trees.length; i++) {
    for (let j = 0; j < trees[i].length; j++) {
      if (upColVis[j][i] || downColVis[j][i] || rightRowVis[i][j] || leftRowVis[i][j]) {
        totalVisible++;
      }
    }
  }
  return totalVisible;
}

console.log(await process());