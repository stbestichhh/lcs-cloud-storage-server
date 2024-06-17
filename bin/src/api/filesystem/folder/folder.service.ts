import { Folder } from '../models';
import { NextFunction, Request, Response } from 'express';
import fs from 'fs/promises';
import { isExists } from '@stlib/utils';
import { buildDirectoryTree } from '../../../utils';
import { BadRequestException, NotFoundException } from '../../../../lib/error';
import { getFilePath } from '../../../utils/getFilePath';
import path from 'path';
import { UserEntity } from '../../../../lib/db';
import { storagePath } from '../../../../lib/config';

type DataType = {
  directoryPath: string;
  newDirectoryPath: string;
  directoryName: string;
  email?: string;
};
type CommandFunctionType = (
  req: Request,
  res: Response,
  next: NextFunction,
  data: DataType,
) => unknown;

export class FolderService {
  private readonly cmd: { [key: string]: CommandFunctionType };

  constructor() {
    this.cmd = {
      ls: this._listdir.bind(this),
      tree: this._listdir.bind(this),
      md: this._makedir.bind(this),
      mv: this._move.bind(this),
      mvu: this._moveToUser.bind(this),
      rmrf: this._remove.bind(this),
    };
  }

  static async handleCommand(req: Request, res: Response, next: NextFunction) {
    const serviceInstance = new FolderService();
    const command = req.query.cmd?.toString();
    const uuid = req.user.sub!;
    const { path: relativePath, newPath } = req.body;
    const directoryName = path.basename(relativePath);
    const directoryPath = getFilePath(uuid, relativePath);
    const newDirectoryPath = getFilePath(uuid, newPath ?? 'ERR');

    if (!command) {
      return next(new BadRequestException('No command provided.'));
    }

    const data: DataType = { directoryPath, newDirectoryPath, directoryName };
    const commandFunction = serviceInstance.cmd[command];
    if (!commandFunction) {
      return next();
    }
    return await commandFunction(req, res, next, data);
  }

  private async _checkDirectoryExists(dirpath: string, next: NextFunction) {
    if (!(await isExists(dirpath))) {
      next(new BadRequestException('No such file or directory.'));
      return false;
    }
    return true;
  }

  private async _listdir(
    req: Request,
    res: Response,
    next: NextFunction,
    data: DataType,
  ) {
    const { directoryPath } = data;

    if (!(await this._checkDirectoryExists(directoryPath, next))) return;

    const stats = await fs.stat(directoryPath);
    if (stats.isFile()) {
      return next(new BadRequestException('ls: Target path is a file'));
    }

    let files;
    if (req.query.cmd === 'ls') {
      files = await Folder.list(directoryPath);
    } else if (req.query.cmd === 'tree') {
      files = buildDirectoryTree(directoryPath);
    }

    return res.status(200).json({ files });
  }

  private async _makedir(
    req: Request,
    res: Response,
    next: NextFunction,
    data: DataType,
  ) {
    const { directoryPath, directoryName } = data;

    const directory = new Folder(directoryName);
    await directory.create(path.dirname(directoryPath));
    return res.status(201).json({ message: 'Directory created.' });
  }

  private async _move(
    req: Request,
    res: Response,
    next: NextFunction,
    data: DataType,
  ) {
    const { directoryPath, newDirectoryPath } = data;

    if (!newDirectoryPath || path.basename(newDirectoryPath) === 'ERR') {
      return next(new BadRequestException('No such file or directory.'));
    }
    if (
      !(await this._checkDirectoryExists(directoryPath, next)) ||
      !(await this._checkDirectoryExists(path.dirname(newDirectoryPath), next))
    )
      return;

    await Folder.move(directoryPath, newDirectoryPath);
    return res.status(200).json({ message: 'File or directory moved.' });
  }

  private async _remove(
    req: Request,
    res: Response,
    next: NextFunction,
    data: DataType,
  ) {
    const { directoryPath } = data;

    if (!(await this._checkDirectoryExists(directoryPath, next))) return;

    await Folder.remove(directoryPath);
    return res.status(200).json({ message: 'File or directory removed.' });
  }

  private async _moveToUser(req: Request, res: Response, next: NextFunction, data: DataType) {
    const { email, directoryPath } = data;

    const receiver = await UserEntity.findOne({
      where: {
        email
      }
    });

    if(!receiver) {
      next(new NotFoundException());
    }

    const receiverDirectory = path.join(storagePath, receiver!.uuid);

    if(!(await this._checkDirectoryExists(receiverDirectory, next))) return;
    if(!(await this._checkDirectoryExists(directoryPath, next))) return;

    await Folder.move(directoryPath, receiverDirectory);
    return res.status(200).json({ message: `File or directory sent to ${email}.` });
  }
}
