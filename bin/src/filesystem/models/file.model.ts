import * as fs from 'fs/promises';
import { PathLike } from 'node:fs';

export class File {
  public readonly content: string | undefined;

  constructor(content?: string) {
    this.content = content;
  }

  async create(filePath: PathLike): Promise<void> {
    return await fs.writeFile(filePath, this.content || '');
  }

  static async read(filePath: PathLike): Promise<string> {
    return await fs.readFile(filePath, { encoding: 'utf-8' });
  }

  static async remove(dirpath: PathLike): Promise<void> {
    return await fs.rm(dirpath);
  }
}
