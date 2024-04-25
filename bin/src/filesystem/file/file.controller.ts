import { remove, download, create } from './file.service';
import { Request, Response } from 'express';

export const _create = async (req: Request, res: Response) => {
  return await create(req, res);
}

export const _remove = async (req: Request, res: Response) => {
  return await remove(req, res);
};

export const _download = async (req: Request, res: Response) => {
  return await download(req, res);
};
