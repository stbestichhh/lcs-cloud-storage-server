import { Request, Response } from 'express';

export const getUser = async (req: Request, res: Response) => {
  return res.status(200).json(req.user);
};
