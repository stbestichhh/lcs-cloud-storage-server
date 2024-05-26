import { AuthRouter } from '../auth';
import { FileRouter, FolderRouter } from '../filesystem';
import express from 'express';
import cors from 'cors';
import { OptionValues } from 'commander';
import * as pem from 'pem';
import * as https from 'https';
import { config } from '../../lib/config';
import { handleErrorSync } from '@stlib/utils';
import { errorHandler, limiter } from '../middleware';
import { connectDb } from '../../lib/db';
import { UserRouter } from '../user';

export const app = express();

app.use(express.json());
app.use(cors());
app.use(limiter);
app.use('/auth', AuthRouter);
app.use('/storage', FolderRouter);
app.use('/storage', FileRouter);
app.use('/user', UserRouter);
app.use(errorHandler);

export const start = async (options: OptionValues) => {
  try {
    await connectDb();

    const PORT: number =
      options.port || config.get('dport') || process.env.PORT || 9110;

    const HOST: string =
      options.host || config.get('dhost') || process.env.HOST || 'localhost';

    if (options.https) {
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
    handleErrorSync(error, { throw: true, message: 'Server crashed on startup.' });
  }
};
