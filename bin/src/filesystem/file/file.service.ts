import {
  handleServerError,
  extractPath,
  FileSystemCommand,
  isExists,
} from '../../utils';
import { File } from '../models';
import { Request, Response } from 'express';
import path from 'path';

export const read = async (req: Request, res: Response) => {
  try {
    const userDir = req.user.sub;
    if (!userDir) {
      return res.status(403).json({ error: 'Forbidden.' });
    }

    const filepath = extractPath(req.path, userDir, FileSystemCommand.Read);
    const fileExists = await isExists(filepath);

    if(!fileExists) {
      return res.status(403).json({ error: `cat: ${filepath}: No such file or directory`})
    }

    const content = await File.read(filepath);

    return res.status(200).json({ content });
  } catch (error) {
    await handleServerError(error, 403, res, 'Path does not exist.');
  }
}

export const create = async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    const userDir = req.user.sub;

    if (!userDir) {
      return res.status(403).json({ error: 'Forbidden.' });
    }

    const filepath = extractPath(
      req.path,
      userDir,
      FileSystemCommand.TouchFile,
    );

    const cuttedFilepath = filepath.slice(0, -path.basename(filepath).length);
    const pathExists = await isExists(cuttedFilepath);

    if(!pathExists) {
      return res.status(403).json({ error: `touch: ${filepath}: No such file or directory`})
    }

    const file = new File(content);
    await file.create(filepath);

    return res.status(201).json({ message: 'File created.', path: filepath });
  } catch (error) {
    await handleServerError(error, 500, res);
  }
}

export const remove = async (req: Request, res: Response) => {
  try {
    const userDir = req.user.sub;

    if (!userDir) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const filePath = extractPath(req.path, userDir, FileSystemCommand.Remove);

    const fileExists = await isExists(filePath);

    if (!fileExists || req.path === FileSystemCommand.Remove) {
      return res.status(403).json({ error: 'The path does not exist.' });
    }

    await File.remove(filePath);
    return res.status(200).json({ message: 'File removed.' });
  } catch (error) {
    await handleServerError(error, 500, res);
  }
};

export const download = async (req: Request, res: Response) => {
  const userDir = req.user.sub;
  if (!userDir) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const filePath = extractPath(req.path, userDir, FileSystemCommand.Download);

  const dirExists = await isExists(filePath);

  if (!dirExists || req.path === FileSystemCommand.Download) {
    return res.status(403).json({ error: 'The path does not exist.' });
  }

  return res.download(filePath, async (error) => {
    await handleServerError(error, 500, res);
  });
};
