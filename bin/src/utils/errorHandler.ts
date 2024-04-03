import { Response } from 'express';

export const handleError = async (
  error: Error | undefined,
  code: number,
  res: Response,
  message?: string,
) => {
  if (error) {
    res.status(code).json({ error: message });
    throw error;
  }
};
