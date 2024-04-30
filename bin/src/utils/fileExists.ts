import { PathLike } from 'node:fs';
import * as fs from 'fs/promises';
import * as node_path from 'path';

export const isExists = async (
  path: PathLike,
  create?: boolean,
  content?: string,
) => {
  try {
    await fs.access(path);
    return true;
  } catch (error) {
    if (create) {
      await fs
        .mkdir(node_path.dirname(path.toString()), { recursive: true })
        .then(async () => {
          await fs.writeFile(path, content || '');
        });

      return true;
    }
    return false;
  }
};
