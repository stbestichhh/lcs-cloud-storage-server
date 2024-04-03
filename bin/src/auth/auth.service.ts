import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { handleError } from '../utils';

export const signup = async (req: Request, res: Response, ) => {
  const password = req.body.password;
  const hashRounds = 10;
  bcrypt.hash(password, hashRounds, async (err: Error | undefined, hash: string) => {
    await handleError(err, 500, res);
  });
}
