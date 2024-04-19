import * as fs from 'fs/promises';
import { logfilePath } from '../../config';
import { options } from '../cli';
import { Response } from 'express';

export const handleServerError = async (
  error: unknown,
  code: number,
  res: Response,
  message?: string,
) => {
  if (error && error instanceof Error) {
    console.error(message ?? 'Internal server error.');
    console.error(error);
    return res
      .status(code)
      .json({ error: message ?? 'Internal server error.' });
  }
};

export const handleError = async (error: unknown, message?: string) => {
  if (options.log) {
    await logError(error);
  }

  if (error && error instanceof Error) {
    console.error(message ?? 'Unexpected error.');
    throw error;
  }
};

export const logError = async (error: unknown) => {
  const date = new Date(Date.now()).toISOString();
  const logData = `[${date}] ${error}`;
  await fs.appendFile(logfilePath, logData);
};
