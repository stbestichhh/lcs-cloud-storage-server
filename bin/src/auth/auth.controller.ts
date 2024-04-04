import dotenv from 'dotenv';
import { Request, Response } from 'express';
import { signin, signup } from './auth.service';

dotenv.config();

export const _signup = async (req: Request, res: Response) => {
  return signup(req, res);
};

export const _signin = async (req: Request, res: Response) => {
  return signin(req, res);
};
