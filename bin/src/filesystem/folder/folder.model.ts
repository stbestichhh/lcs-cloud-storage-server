import * as fs from 'fs/promises';
import path from 'path';
import { PathLike } from 'node:fs';

export class Folder {
  public readonly name: string;

  constructor(name: string) {
    this.name = name;
  }

  async create(dirpath: PathLike): Promise<string | undefined> {
    return fs.mkdir(path.join(String(dirpath), this.name), { recursive: true });
  }

  static async list(dirpath: PathLike): Promise<string[]> {
    return await fs.readdir(dirpath);
  }

  static async delete(dirpath: PathLike): Promise<void> {
    return await fs.rm(dirpath, { recursive: true, force: true });
  }
}
