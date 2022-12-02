import input from "./actualTestData.js";

const elves = [0];
for (const calories of input) {
  if (calories) {
    elves[elves.length - 1] = calories + elves[elves.length - 1];
  } else {
    elves.push(0);
  }
}

elves.sort(function(a, b) {
  return a - b;
});
console.log(elves[elves.length-1] + elves[elves.length-2] + elves[elves.length-3]);