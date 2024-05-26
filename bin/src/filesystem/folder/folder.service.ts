import { Folder } from '../models';
import { NextFunction, Request, Response } from 'express';
import fs from 'fs/promises';
import node_path from 'path';
import { storagePath } from '../../../lib/config';
import { isExists } from '@stlib/utils';
import { buildDirectoryTree } from '../../utils';
import { BadRequestException } from '../../../lib/error';

export const listdir = async (req: Request, res: Response, next: NextFunction) => {
    const uuid = req.user.sub!;
    const { path } = req.body;

    const dirpath = node_path.join(storagePath, uuid, path ?? '');
    const dirExists = await isExists(dirpath);

    if (!dirExists) {
      return next(new BadRequestException('ls: No such file or directory'))
    }

    const stats = await fs.stat(dirpath);

    if (stats.isFile()) {
      return next(new BadRequestException('ls: Target path is a file'))
    }

    const files = await Folder.list(dirpath);

    return res.status(200).json({ files });
};

export const listTree = async (req: Request, res: Response, next: NextFunction) => {
    const uuid = req.user.sub!;
    const { path } = req.body;

    const dirpath = node_path.join(storagePath, uuid, path ?? '');
    const dirExists = await isExists(dirpath);

    if (!dirExists) {
      return next(new BadRequestException('tree: No such file or directory'))
    }

    const stats = await fs.stat(dirpath);

    if (stats.isFile()) {
      return next(new BadRequestException('tree: target path is a file'));
    }

    const tree = buildDirectoryTree(dirpath);

    return res.status(200).json({ tree });
};

export const makedir = async (req: Request, res: Response, next: NextFunction) => {
    const uuid = req.user.sub!;
    const { dirname, path } = req.body;

    if (!dirname || dirname === '') {
      return next(new BadRequestException('mkdir: Provide a directory name.'))
    }

    const dirpath = node_path.join(storagePath, uuid, path ?? '');
    const dir = new Folder(dirname);
    await dir.create(dirpath);

    return res.status(201).json({ message: 'Directory created.' });
};

export const move = async (req: Request, res: Response, next: NextFunction) => {
    const uuid = req.user.sub!;
    const { path, newpath } = req.body;

    const dirpath = node_path.join(storagePath, uuid, path);
    const newdirpath = node_path.join(storagePath, uuid, newpath);

    const oldpathExists = await isExists(dirpath);
    const newpathExists = await isExists(node_path.dirname(newdirpath));

    if (!oldpathExists || !newpathExists || path === '' || newpath === '') {
      return next(new BadRequestException('mv: No such file or directory'))
    }

    await Folder.move(dirpath, newdirpath);

    return res.status(200).json({ message: 'File moved.' });
};

export const removedir = async (req: Request, res: Response, next: NextFunction) => {
    const uuid = req.user.sub!;
    const { path } = req.body;

    const dirpath = node_path.join(storagePath, uuid, path);
    const dirExists = await isExists(dirpath);

    if (path === '' || !dirExists) {
      return next(new BadRequestException('rmdir: No such file or directory'))
    }

    await Folder.remove(dirpath);

    return res.status(200).json({ message: 'Directory removed.' });
};
