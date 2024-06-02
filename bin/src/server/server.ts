import { AuthRouter, FileRouter, FolderRouter, UserRouter } from '../api';
import express from 'express';
import cors from 'cors';
import { OptionValues } from 'commander';
import * as pem from 'pem';
import * as https from 'https';
import { config } from '../../lib/config';
import { handleErrorSync, options } from '@stlib/utils';
import { errorHandler, limiter } from '../middleware';
import { connectDb } from '../../lib/db';
import { clearBlacklistJob } from '../scheduler';
import helmet from 'helmet';
import morgan from 'morgan';
import { commonConf, devConf } from '../../lib/logging';

export const app = express();

if (options?.log !== undefined) {
  app.use(morgan('dev', devConf));
  app.use(morgan('common', commonConf));
}

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(limiter);
app.use('/api/v3/auth', AuthRouter);
app.use('/api/v3/storage', FolderRouter);
app.use('/api/v3/storage', FileRouter);
app.use('/api/v3/user', UserRouter);
app.use(errorHandler);

export const start = async (options: OptionValues) => {
  try {
    await connectDb();
    clearBlacklistJob.start();

    const PORT: number =
      options.port || config.get('dport') || process.env.PORT || 9110;

    const HOST: string =
      options.host || config.get('dhost') || process.env.HOST || 'localhost';

    if (options.secure) {
      const days: number = options.https;

      return pem.createCertificate(
        { days, selfSigned: true },
        async (error, keys) => {
          handleErrorSync(error, { throw: true });

          https
            .createServer({ key: keys.clientKey, cert: keys.certificate }, app)
            .listen(PORT, HOST, () => {
              console.log(`Server listening on https://${HOST}:${PORT}`);
            });
        },
      );
    }

    app.listen(PORT, HOST, () => {
      console.log(`Server listening on http://${HOST}:${PORT}`);
    });
  } catch (error) {
    handleErrorSync(error, {
      throw: true,
      message: 'Server crashed on startup.',
    });
  }
};
