import { Request, Response } from 'express';
import { handleServerError } from '../../utils';
import { extractPath, fsCommand } from '../../utils/pathFromUrl';
import { Folder } from '../models/folder.model';
import path from 'path';
import { storageRoot } from '../../../config';

export const listdir = async (req: Request, res: Response) => {
  try {
    const userDir = req.user.sub;
    if (!userDir) {
      return res.status(404).json({ error: 'Forbidden.' });
    }

    const dirpath = extractPath(req.path, userDir, fsCommand.ls);
    const files = await Folder.list(dirpath);
    return res.status(200).json(files);
  } catch (error) {
    await handleServerError(error, 500, res);
  }
};

export const makedir = async (req: Request, res: Response) => {
  try {
    const userDir = req.user.sub;
    if (!userDir) {
      return res.status(400).json({ error: 'Forbidden.' });
    }

    const dirpath = extractPath(req.path, userDir, fsCommand.md);
    if (!req.body.dirname || req.body.dirname === '') {
      return res.status(400).json({ error: 'Provide a directory name.' });
    }
    const dir = new Folder(req.body.dirname);
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

    const dirpath = extractPath(req.path, userDir, fsCommand.mv);
    const newDirpath = path.join(storageRoot, userDir, req.body.newDirpath);
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

    const dirPath = extractPath(req.path, userDir, fsCommand.rmrf);
    await Folder.remove(dirPath);
    return res.status(200).json({ message: 'Directory removed.' });
  } catch (error) {
    await handleServerError(error, 500, res);
  }
};
