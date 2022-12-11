import { open } from "node:fs/promises";

class Pasta {
  constructor(parent, name, size) {
    this.parent = parent;
    this.name = name;
    this.size = size;
    this.children = [];
  }
}

async function getInput(filename) {
  const file = await open(filename);
  const fileContents = await file.readFile();
  await file.close();
  return fileContents.toString().split("\r\n");
}

const dirsWithSizes = [];
function processDir(dir) {
  let size = 0;
  for (const child of dir.children) {
    if (child.size) {
      size += child.size;
    } else {
      size += processDir(child);
    }
  }
  dirsWithSizes.push({
    "name": dir.name,
    "size": size
  });
  return size;
}

async function process() {
  const allLines = await getInput('./inputData.txt');
  let tree = new Pasta(null, "/");
  let curDir = tree;
  for (const line of allLines) {
    const splitRes = line.split(' ');
    if (line[0] == '$') {
      if (splitRes[1] == 'cd') {
        // process cd
        if (splitRes[2] == '/') {
          curDir = tree;
        } else if (splitRes[2] == '..') {
          curDir = curDir.parent;
        } else {
          // there should be error checking here but there isn't so deal with it nerd.
          curDir = curDir.children.find(child => child.name == splitRes[2]);
        }
      }
    } else {
      if (splitRes[0] == 'dir') {
        curDir.children.push(new Pasta(curDir, splitRes[1]));
      } else {
        curDir.children.push(new Pasta(curDir, splitRes[1], parseInt(splitRes[0])))
      }
    }
  }
  const sizeNeeded = 30000000;
  const totalSize = 70000000;
  processDir(tree);
  const curFreeSpace = totalSize - dirsWithSizes.find(dir => dir.name == '/').size;
  return Math.min(...dirsWithSizes.filter(dir => dir.size > sizeNeeded-curFreeSpace).map(dir => dir.size));
}

console.log(await process());