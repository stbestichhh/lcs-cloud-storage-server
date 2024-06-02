import fs from 'fs';
import { Request, Response } from 'express';
import { logfilePath } from '../config';
import { isExistsSync, options } from '@stlib/utils';

let logExists: boolean = false;

if (options?.log !== undefined) {
  logExists = isExistsSync(logfilePath, {
    create: true,
    recursive: true,
    content: '/',
  });

  if (!logExists) {
    throw new Error(`Cannot find 'log' directory.`);
  }
}

export const devConf = {
  skip: (req: Request, res: Response) => {
    return res.statusCode < 400;
  },
};

export const commonConf = logExists
  ? {
      stream: fs.createWriteStream(logfilePath, { flags: 'a' }),
    }
  : {};
