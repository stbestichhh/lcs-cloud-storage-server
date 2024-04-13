import { PathLike } from 'node:fs';
import * as fs from 'fs/promises';

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
      return await fs.writeFile(path, content || '');
    }
    return false;
  }
};
