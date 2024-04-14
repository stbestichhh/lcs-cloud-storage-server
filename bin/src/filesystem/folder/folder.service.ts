import { Request, Response } from 'express';
import { handleServerError } from '../../utils';
import { extractPath, fsCommand } from '../../utils/pathFromUrl';
import { Folder } from '../models/folder.model';
import path from 'path';
import { storageRoot } from '../../../config';
import { isExists } from '../../utils/fileExists';

export const listdir = async (req: Request, res: Response) => {
  try {
    const userDir = req.user.sub;
    if (!userDir) {
      return res.status(403).json({ error: 'Forbidden.' });
    }

    const dirpath = extractPath(req.path, userDir, fsCommand.ls);
    const files = await Folder.list(dirpath);
    return res.status(200).json(files);
  } catch (error) {
    await handleServerError(error, 403, res, 'Path does not exist.');
  }
};

export const makedir = async (req: Request, res: Response) => {
  try {
    const userDir = req.user.sub;
    if (!userDir) {
      return res.status(403).json({ error: 'Forbidden.' });
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
    await handleServerError(error, 403, res, 'The path to move in does not exist.');
  }
};

export const removedir = async (req: Request, res: Response) => {
  try {
    const userDir = req.user.sub;
    if (!userDir) {
      return res.status(404).json({ error: 'Forbidden' });
    }

    const dirPath = extractPath(req.path, userDir, fsCommand.rmrf);
    const dirExists = await isExists(dirPath);
    console.log(req.path);
    if(!dirExists || req.path === fsCommand.rmrf) {
      return res.status(403).json({ error: 'The path to delete does not exist.' });
    }
    await Folder.remove(dirPath);
    return res.status(200).json({ message: 'Directory removed.' });
  } catch (error) {
    await handleServerError(error, 500, res);
  }
};
