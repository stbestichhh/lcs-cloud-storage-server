import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { AbstractError, handleErrorSync, isError } from '@stlib/utils';

export const errorHandler: ErrorRequestHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!isError(error)) {
    next();
  }

  if (error instanceof AbstractError) {
    return res.status(error.code).json({ error: error.message });
  }

  handleErrorSync(error);
  return res.status(500).json({ error: 'Server internal error.' });
};
