import { Response } from 'express';
import colors from '@colors/colors/safe';

export const handleError = async (
  error: unknown,
  code: number,
  res: Response,
  message?: string,
) => {
  if (error && error instanceof Error) {
    console.error(colors.red(message ?? 'Unexpected error'));
    console.error(error);
    return res.status(code).json({ error: message ?? 'Internal server error' });
  }
};
