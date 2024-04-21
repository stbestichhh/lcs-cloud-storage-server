import {
  handleServerError,
  extractPath,
  FileSystemCommand,
  isExists,
} from '../../utils';
import { File } from '../models/file.model';
import { Request, Response } from 'express';

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
