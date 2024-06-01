import { File } from '../models';
import { NextFunction, Request, Response } from 'express';
import * as fs from 'fs/promises';
import { isExists } from '@stlib/utils';
import { BadRequestException } from '../../../../lib/error';
import { getFilePath } from '../../../utils/getFilePath';
import path from 'path';

type DataType = { filePath: string, content: string };
type CommandFunctionType = (req: Request, res: Response, next: NextFunction, data: DataType) => unknown;

export class FileService {
  private readonly cmd: { [key: string]: CommandFunctionType };

  constructor() {
    this.cmd = {
      cat: this._read.bind(this),
      touch: this._touch.bind(this),
      rm: this._remove.bind(this),
      download: this._download.bind(this),
    }
  }

  static async handleCommand(req: Request, res: Response, next: NextFunction) {
    const serviceInstance = new FileService()
    const command = req.query.cmd?.toString();
    const uuid = req.user.sub!;
    const { path: relativePath, content } = req.body;
    const filePath = getFilePath(uuid, relativePath);

    if(!command) {
      return next(new BadRequestException('No command provided.'));
    }

    const data: DataType = { filePath, content };
    return await serviceInstance.cmd[command](req, res, next, data);
  }

  private async _checkFileExists(filepath: string, next: NextFunction) {
    if(!(await isExists(filepath))) {
      next(new BadRequestException('No such file or directory.'));
      return false;
    }
    return true;
  }

  private async _read (req: Request, res: Response, next: NextFunction, data: DataType) {
    const { filePath } = data;

    if(!(await this._checkFileExists(filePath, next))) return;

    const stats = await fs.stat(filePath);
    if (stats.isDirectory()) {
      return next(new BadRequestException('cat: Target is a directory.'));
    }

    const content = await File.read(filePath);
    return res.status(200).json({ content });
  }

  private async _touch(req: Request, res: Response, next: NextFunction, data: DataType) {
    const { filePath, content } = data;
    const directoryPath = path.dirname(filePath);

    if(!(await this._checkFileExists(directoryPath, next))) return;


    const file = new File(content);
    await file.create(filePath);
    return res.status(201).json({ message: 'File created.' });
  }

  private async _remove(req: Request, res: Response, next: NextFunction, data: DataType) {
    const { filePath } = data;

    if(!(await this._checkFileExists(filePath, next))) return;

    await File.remove(filePath);
    return res.status(200).json({ message: 'File deleted.'})
  }

  private async _download(req: Request, res: Response, next: NextFunction, data: DataType) {
    const { filePath } = data;

    if(!(await this._checkFileExists(filePath, next))) return;

    return res.download(filePath, (error) => {
      if(error) {
        next(new BadRequestException('Cannot donwload directories.'));
      }
    });
  }
}
