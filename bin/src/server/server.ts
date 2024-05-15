import { handleError, limiter } from '../utils';
import { loginValidation } from '../middleware';
import { AuthRouter, _getUser } from '../auth';
import { FileRouter } from '../filesystem';
import { LcsConfig } from '../../config';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { OptionValues } from 'commander';
import * as pem from 'pem';
import * as https from 'https';

dotenv.config();

// pem.config({
//   pathOpenSSL: certDirectory,
// });

export const app = express();
app.use(express.json());
app.use(cors());
app.use(limiter);

app.get('/', (_req, res) => {
  res.sendStatus(200);
});

app.get('/protected', loginValidation, (_req, res) => {
  res.sendStatus(200);
});

app.get('/me', loginValidation, _getUser);
app.use('/auth', AuthRouter);
app.use('/storage', FileRouter);

export const start = async (options: OptionValues) => {
  try {
    const PORT: number =
      options.port ||
      Number(LcsConfig.get('dport')) ||
      process.env.PORT ||
      9110;

    const HOST: string =
      options.host || LcsConfig.get('dhost') || process.env.HOST || 'localhost';

    if (options.https) {
      const days: number = Number(options.https);
      return pem.createCertificate(
        { days, selfSigned: true },
        async (error, keys) => {
          await handleError(error);

          https
            .createServer({ key: keys.clientKey, cert: keys.certificate }, app)
            .listen(PORT, () => {
              console.log(`Server listening on https://${HOST}:${PORT}`);
            });
        },
      );
    }

    app.listen(PORT, () => {
      console.log(`Server listening on http://${HOST}:${PORT}`);
    });
  } catch (error) {
    await handleError(error);
  }
};
