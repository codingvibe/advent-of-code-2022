import { open } from "node:fs/promises"

async function getInput(filename) {
  const file = await open(filename);
  const fileContents = await file.readFile();
  await file.close();
  return fileContents.toString().split("\r\n");
}

function processLine(line) {
  const forwardLooking = {};
  const reverseLooking = {};
  const forwardResults = [];
  const reverseResults = [];
  for (let i = 0; i < line.length; i++) {
    const j = line.length - i - 1;
    const forwardHeight = parseInt(line[i]);
    const reverseHeight = parseInt(line[j]);

    let minDistance = i;
    for (let search = forwardHeight; search <= 9; search++) {
      if (forwardLooking[search] && minDistance > (i - forwardLooking[search])) {
        minDistance = i - forwardLooking[search];
      }
    }
    forwardResults.push(minDistance);
    forwardLooking[forwardHeight] = i;

    minDistance = i;
    for (let search = reverseHeight; search <= 9; search++) {
      if (reverseLooking[search] && minDistance > (reverseLooking[search] - j)) {
        minDistance = reverseLooking[search] - j;
      }
    }
    reverseResults.unshift(minDistance);
    reverseLooking[reverseHeight] = j;
  }

  const distanceResults = [];
  for (let i = 0; i < line.length; i++) {
    distanceResults.push({
      "forward": forwardResults[i],
      "reverse": reverseResults[i]
    });
  }
  return distanceResults;
}

async function process() {
  const trees = await getInput("./inputData.txt");
  const leftRightVis = [];
  const upDownVis = [];
  for (let i = 0; i < trees.length; i++) {
    leftRightVis.push(processLine(trees[i]));
  }
  for (let i = 0; i < trees[0].length; i++) {
    let colLine = ""
    for (let j = 0; j < trees.length; j++) {
      colLine += trees[j][i];
    }
    upDownVis.push(processLine(colLine));
  }

  const scenicScores = [];
  let maxScenicScore = -1;
  let maxScenicScoreI = -1;
  let maxScenicScoreJ = -1;
  for (let i = 0; i < trees.length; i++) {
    scenicScores.push([])
    for (let j = 0; j < trees[i].length; j++) {
      const curScenicScore = leftRightVis[i][j].forward * leftRightVis[i][j].reverse * upDownVis[j][i].forward * upDownVis[j][i].reverse
      if (curScenicScore > maxScenicScore) {
        maxScenicScore = curScenicScore;
        maxScenicScoreI = i;
        maxScenicScoreJ = j;
      }
      scenicScores[i].push(curScenicScore);
    }
  }
  for (let i = 0; i <scenicScores.length; i++) {
    console.log(`[${scenicScores[i].join(",")}]`);
  }
  console.log(`(${maxScenicScoreI},${maxScenicScoreJ}) with a value of ${trees[maxScenicScoreI][maxScenicScoreJ]}`)
  return maxScenicScore
}

console.log(await process());