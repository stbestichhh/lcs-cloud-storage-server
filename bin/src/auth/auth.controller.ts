import dotenv from 'dotenv';
import { Request, Response } from 'express';
import { signin, signup, getUser } from './auth.service';

dotenv.config(); //? Why it that here?

export const _signup = async (req: Request, res: Response) => {
  return await signup(req, res);
};

export const _signin = async (req: Request, res: Response) => {
  return await signin(req, res);
};

export const _getUser = async (req: Request, res: Response) => {
  return await getUser(req, res);
};
