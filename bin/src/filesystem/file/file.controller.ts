import { Request, Response } from 'express';
import { remove } from './file.service';

export const _remove = async (req: Request, res: Response) => {
  return await remove(req, res);
};
