import { File } from '../models';
import { Request, Response } from 'express';
import node_path from 'path';
import * as fs from 'fs/promises';
import { storagePath } from '../../../lib/config';
import { handleError, handleErrorSync, isExists } from '@stlib/utils';

export const read = async (req: Request, res: Response) => {
  try {
    const uuid = req.user.sub;
    const { path } = req.body;

    if (!uuid) {
      return res.status(403).json({ error: 'Forbidden.' });
    }

    const filepath = node_path.join(storagePath, uuid, path);
    const fileExists = await isExists(filepath);

    if (!fileExists) {
      return res.status(400).json({ error: `cat: No such file or directory` });
    }

    const stats = await fs.stat(filepath);

    if (stats.isDirectory()) {
      return res.status(400).json({ error: `cat: Is a directory` });
    }

    const content = await File.read(filepath);

    return res.status(200).json({ content });
  } catch (error) {
    handleErrorSync(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const uuid = req.user.sub;
    const { content, path } = req.body;

    if (!uuid) {
      return res.status(403).json({ error: 'Forbidden.' });
    }

    const filepath = node_path.join(storagePath, uuid, path);
    const cuttedFilepath = filepath.slice(0, -path.basename(filepath).length);
    const pathExists = await isExists(cuttedFilepath);

    if (!pathExists) {
      return res
        .status(400)
        .json({ error: `touch: No such file or directory` });
    }

    const file = new File(content);
    await file.create(filepath);

    return res.status(201).json({ message: 'File created.' });
  } catch (error) {
    handleErrorSync(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const uuid = req.user.sub;
    const { path } = req.body;

    if (!uuid) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const filePath = node_path.join(storagePath, uuid, path);
    const fileExists = await isExists(filePath);

    if (!fileExists) {
      return res.status(400).json({ error: 'The path does not exist.' });
    }

    await File.remove(filePath);

    return res.status(200).json({ message: 'File removed.' });
  } catch (error) {
    handleErrorSync(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const download = async (req: Request, res: Response) => {
  try {
    const uuid = req.user.sub;
    const { path } = req.body;

    if (!uuid) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const filePath = path.join(storagePath, uuid, path);
    const fileExists = await isExists(filePath);

    if (!fileExists) {
      return res
        .status(400)
        .json({ error: 'download: No such file or directory' });
    }

    return res.download(filePath, async (error) => {
      return await handleError(error, () => {
        res.status(500).json({ error: 'Internal server error '});
      });
    });
  } catch (error) {
    handleErrorSync(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
