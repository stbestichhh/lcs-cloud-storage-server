import { Request, Response } from 'express';
import { extractPath, fsCommand } from '../../utils/pathFromUrl';
import { handleError } from '../../utils';
import { File } from '../models/file.model';

export const remove = async (req: Request, res: Response) => {
  try {
    const userDir = req.user.sub;
    if (!userDir) {
      return res.status(404).json({ error: 'Forbidden' });
    }

    const filePath = extractPath(req.path, userDir, fsCommand.rm);
    await File.remove(filePath);
    return res.status(200).json({ message: 'File removed.' });
  } catch (error) {
    await handleError(error, 500, res);
  }
};

export const download = async (req: Request, res: Response) => {
  const userDir = req.user.sub;
  if (!userDir) {
    return res.status(404).json({ error: 'Forbidden' });
  }

  const filePath = extractPath(req.path, userDir, fsCommand.download);
  return res.download(filePath, async (error) => {
    await handleError(error, 500, res);
  });
}
