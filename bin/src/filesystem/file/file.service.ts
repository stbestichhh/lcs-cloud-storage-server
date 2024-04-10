import { Request, Response } from 'express';
import { extractPath, fsCommand } from '../../utils/pathFromUrl';
import { handleError } from '../../utils';
import { File } from '../models/file.model';

export const remove = async (req: Request, res: Response) => {
  try {
    const filePath = extractPath(req.path, fsCommand.rm);
    await File.remove(filePath);
    return res.status(200).json({ message: 'File removed.' });
  } catch (error) {
    await handleError(error, 500, res);
  }
};
