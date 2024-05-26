import * as fs from 'fs';
import * as path from 'path';

interface DirectoryTree {
  [key: string]: DirectoryTree | null;
}

export const buildDirectoryTree = (dirPath: string): DirectoryTree => {
  const tree: DirectoryTree = {};
  const items = fs.readdirSync(dirPath);

  items.forEach(item => {
    const fullPath = path.join(dirPath, item);
    const isDirectory = fs.statSync(fullPath).isDirectory();

    if (isDirectory) {
      tree[item] = buildDirectoryTree(fullPath);
    } else {
      tree[item] = null;
    }
  });

  return tree;
}
