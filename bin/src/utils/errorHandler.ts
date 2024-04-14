import { Response } from 'express';
import colors from '@colors/colors/safe';
import { options } from '../cli';
import * as fs from 'fs/promises';
import * as fsSync from 'fs';
import { logfilePath } from '../../config';

export const handleServerError = async (
  error: unknown,
  code: number,
  res: Response,
  message?: string,
) => {
  if (error && error instanceof Error) {
    console.error(colors.red(message ?? 'Internal server error.'));
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
    console.error(colors.red(message ?? 'Unexpected error.'));
    throw error;
  }
};

export const handleErrorSync = (error: unknown, message?: string) => {
  if (options.log) {
    logErrorSyns(error);
  }

  if (error && error instanceof Error) {
    console.error(colors.red(message ?? 'Unexpected error.'));
    throw error;
  }
}

export const logError = async (error: unknown) => {
  const date = new Date(Date.now()).toISOString();
  const logData = `[${date}] ${error}`;
  await fs.appendFile(logfilePath, logData);
};

export const logErrorSyns = (error: unknown) => {
  const date = new Date(Date.now()).toISOString();
  const logData = `[${date}] ${error}`;
  fsSync.appendFileSync(logfilePath, logData);
}
