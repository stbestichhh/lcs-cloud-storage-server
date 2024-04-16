import { listdir, makedir, move, removedir } from './folder.service';
import { Request, Response } from 'express';

export const _listdir = async (req: Request, res: Response) => {
  return await listdir(req, res);
};

export const _makedir = async (req: Request, res: Response) => {
  return await makedir(req, res);
};

export const _move = async (req: Request, res: Response) => {
  return await move(req, res);
};

export const _removedir = async (req: Request, res: Response) => {
  return await removedir(req, res);
};
