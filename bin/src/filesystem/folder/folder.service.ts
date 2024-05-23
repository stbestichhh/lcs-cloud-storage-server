import { Folder } from '../models';
import { Request, Response } from 'express';
import fs from 'fs/promises';
import node_path from 'path';
import { storagePath } from '../../../lib/config';
import { handleErrorSync, isExists } from '@stlib/utils';

export const listdir = async (req: Request, res: Response) => {
  try {
    const uuid = req.user.sub;
    const { path } = req.body;

    if (!uuid) {
      return res.status(403).json({ error: 'Forbidden.' });
    }

    const dirpath = node_path.join(storagePath, uuid, path);
    const dirExists = await isExists(dirpath);

    if (!dirExists) {
      return res.status(400).json({ error: `ls: No such file or directory` });
    }

    const stats = await fs.stat(dirpath);

    if (stats.isFile()) {
      return res.status(400).json({ error: `ls: Is a file` });
    }

    const files = await Folder.list(dirpath);

    return res.status(200).json({ files });
  } catch (error) {
    handleErrorSync(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const makedir = async (req: Request, res: Response) => {
  try {
    const uuid = req.user.sub;
    const { dirname, path } = req.body;

    if (!uuid) {
      return res.status(403).json({ error: 'Forbidden.' });
    }

    if (!dirname || dirname === '') {
      return res
        .status(400)
        .json({ error: 'mkdir: Provide a directory name.' });
    }

    const dirpath = node_path.join(storagePath, uuid, path);
    const dir = new Folder(dirname);
    await dir.create(dirpath);

    return res.status(201).json({ message: 'Directory created.' });
  } catch (error) {
    handleErrorSync(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const move = async (req: Request, res: Response) => {
  try {
    const uuid = req.user.sub;
    const { path, newpath } = req.body;

    if (!uuid) {
      return res.status(404).json({ error: 'Forbidden' });
    }

    const dirpath = node_path.join(storagePath, uuid, path);
    const newdirpath = node_path.join(storagePath, uuid, newpath);

    if (path === '' || req.path === '/mv') {
      return res.status(403).json({ error: `mv: No such file or directory` });
    }

    const oldpathExists = await isExists(dirpath);
    // const newpathExists = await isExists(path.dirname(newdirpath));

    if (!oldpathExists /* || !newpathExists */) {
      return res.status(400).json({ error: `mv: No such file or directory` });
    }

    await Folder.move(dirpath, newdirpath);

    return res.status(200).json({ message: 'Directory moved.' });
  } catch (error) {
    handleErrorSync(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const removedir = async (req: Request, res: Response) => {
  try {
    const uuid = req.user.sub;
    const { path } = req.body;

    if (!uuid) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const dirpath = node_path.join(storagePath, uuid, path)
    const dirExists = await isExists(dirpath);

    if (!dirExists) {
      return res
        .status(400)
        .json({ error: 'rmdir: No such file or directory' });
    }

    await Folder.remove(dirpath);

    return res.status(200).json({ message: 'Directory removed.' });
  } catch (error) {
    handleErrorSync(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
