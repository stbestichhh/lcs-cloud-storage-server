import * as fs from 'fs/promises';
import { PathLike } from 'node:fs';

export class File {
  static async remove(dirpath: PathLike): Promise<void> {
    return await fs.rm(dirpath);
  }
}
