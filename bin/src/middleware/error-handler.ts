import { ErrorRequestHandler, Request, Response } from 'express';
import { AbstractError } from '@stlib/utils';

export const errorHandler: ErrorRequestHandler = (error: Error, req: Request, res: Response) => {
  if(error instanceof AbstractError) {
    return res.status(error.code).json({ error: error.message });
  }

  return res.status(500).json({ error: 'Server internal error.' });
}
