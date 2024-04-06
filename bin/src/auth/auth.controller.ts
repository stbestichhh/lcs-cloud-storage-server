import dotenv from 'dotenv';
import { Request, Response } from 'express';
import { signin, signup, getUser } from './auth.service';

dotenv.config();

export const _signup = async (req: Request, res: Response) => {
  return signup(req, res);
};

export const _signin = async (req: Request, res: Response) => {
  return signin(req, res);
};

export const _getUser = async (req: Request, res: Response) => {
  return getUser(req, res);
}
