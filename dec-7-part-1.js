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
function processDir(dir, limit) {
  let size = 0;
  for (const child of dir.children) {
    if (child.size) {
      size += child.size;
    } else {
      size += processDir(child, limit);
    }
  }
  if (size < limit && dir.name != '/') {
    dirsWithSizes.push({
      "name": dir.name,
      "size": size
    });
  }
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
  processDir(tree, 100000);
  let totalSize = 0;
  for (const dir of dirsWithSizes) {
    totalSize += dir.size;
  }
  return totalSize;
}

console.log(await process());