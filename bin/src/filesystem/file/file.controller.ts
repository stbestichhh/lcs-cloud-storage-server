import { remove, download } from './file.service';
import { Request, Response } from 'express';

export const _remove = async (req: Request, res: Response) => {
  return await remove(req, res);
};

export const _download = async (req: Request, res: Response) => {
  return await download(req, res);
};
