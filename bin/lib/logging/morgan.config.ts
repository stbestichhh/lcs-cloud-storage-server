import { Request, Response } from 'express';
import { appNames, logdirectoryPath, logfilePath } from '../config';
import { isExistsSync, options } from '@stlib/utils';
import * as rfs from 'rotating-file-stream';

let logExists: boolean = false;

if (options?.log) {
  logExists = isExistsSync(logfilePath, {
    create: true,
    recursive: true,
    content: '',
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
      stream: rfs.createStream(appNames.logsfile, {
        interval: '1d',
        path: logdirectoryPath,
      }),
    }
  : {};
