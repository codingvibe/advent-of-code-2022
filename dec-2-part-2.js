import { open } from 'node:fs/promises';

const OPPONENT_TO_INDEX = {
  'A': 0,
  'B': 1,
  'C': 2
}

const ME_TO_INDEX = {
  'X': 0,
  'Y': 1,
  'Z': 2
}

async function getInput(filename) {
  const file = await open(filename);
  const fileContents = await file.readFile();
  file.close();
  const allLines = fileContents.toString().split('\r\n');
  return allLines.map(line => line.split(' '));
}

//X = lose
//Y = draw
//Z = win

function toMyMove(opponentMove, outcome) {
  let myMove = -1
  if (outcome == 'X') {
    myMove = (opponentMove - 1) % 3
  } else if (outcome == 'Y') {
    return opponentMove
  } else {
    myMove = (opponentMove + 1) % 3
  }
  if (myMove == -1) {
    myMove = 2;
  }
  return myMove
}

async function getScore() {
  const input = await getInput('./inputData.txt');
  let totalScore = 0;
  for (const match of input) {
    const opponentMove = OPPONENT_TO_INDEX[match[0]];
    const myMove = toMyMove(opponentMove, [match[1]]);
    let score = 0;
    if (opponentMove == myMove) {
      score = 3;
    } else if ((opponentMove + 1) % 3 == myMove) {
      score = 6;
    }
    totalScore = totalScore + score + myMove + 1;
  }
  return totalScore;
}

console.log(await getScore());