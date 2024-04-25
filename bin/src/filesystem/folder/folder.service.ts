import path from 'path';
import {
  extractPath,
  FileSystemCommand,
  handleServerError,
  isExists,
} from '../../utils';
import { Folder } from '../models';
import { storagePath } from '../../../config';
import { Request, Response } from 'express';

export const listdir = async (req: Request, res: Response) => {
  try {
    const userDir = req.user.sub;
    if (!userDir) {
      return res.status(403).json({ error: 'Forbidden.' });
    }

    const dirpath = extractPath(req.path, userDir, FileSystemCommand.List);
    const dirExists = await isExists(dirpath);

    if (!dirExists) {
      return res.status(403).json({ error: `ls: No such file or directory` });
    }

    const files = await Folder.list(dirpath);

    return res.status(200).json(files);
  } catch (error) {
    await handleServerError(error, 500, res);
  }
};

export const makedir = async (req: Request, res: Response) => {
  try {
    const userDir = req.user.sub;
    const { dirname } = req.body;

    if (!userDir) {
      return res.status(403).json({ error: 'Forbidden.' });
    }

    if (!dirname || dirname === '') {
      return res
        .status(403)
        .json({ error: 'mkdir: Provide a directory name.' });
    }

    const dirpath = extractPath(
      req.path,
      userDir,
      FileSystemCommand.MakeDirectory,
    );
    const dir = new Folder(dirname);
    const directory = await dir.create(dirpath);

    return res.status(201).json({ directory });
  } catch (error) {
    await handleServerError(error, 500, res);
  }
};

export const move = async (req: Request, res: Response) => {
  try {
    const userDir = req.user.sub;

    if (!userDir) {
      return res.status(404).json({ error: 'Forbidden' });
    }

    const dirpath = extractPath(req.path, userDir, FileSystemCommand.Move);
    const newDirpath = path.join(storagePath, userDir, req.body.newDirpath);

    if (req.body.newDirpath === '' || req.path === FileSystemCommand.Move) {
      return res.status(403).json({ error: `mv: No such file or directory` });
    }

    const oldpathExists = await isExists(dirpath);
    const newpathExists = await isExists(path.dirname(newDirpath));

    if (!oldpathExists || !newpathExists) {
      return res.status(403).json({ error: `mv: No such file or directory` });
    }

    await Folder.move(dirpath, newDirpath);

    return res.status(200).json({ oldDirpath: dirpath, newDirpath });
  } catch (error) {
    await handleServerError(error, 500, res);
  }
};

export const removedir = async (req: Request, res: Response) => {
  try {
    const userDir = req.user.sub;

    if (!userDir) {
      return res.status(404).json({ error: 'Forbidden' });
    }

    const dirPath = extractPath(
      req.path,
      userDir,
      FileSystemCommand.RemoveRecursive,
    );
    const dirExists = await isExists(dirPath);

    if (!dirExists || req.path === FileSystemCommand.RemoveRecursive) {
      return res
        .status(403)
        .json({ error: 'rmdir: No such file or directory' });
    }

    await Folder.remove(dirPath);

    return res.status(200).json({ message: 'Directory removed.' });
  } catch (error) {
    await handleServerError(error, 500, res);
  }
};
