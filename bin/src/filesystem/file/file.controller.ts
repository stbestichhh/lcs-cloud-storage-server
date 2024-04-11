import { Request, Response } from 'express';
import { remove, download } from './file.service';

export const _remove = async (req: Request, res: Response) => {
  return await remove(req, res);
};

export const _download = async (req: Request, res: Response) => {
  return await download(req, res);
}
