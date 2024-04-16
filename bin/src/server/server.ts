import { handleError, limiter } from '../utils';
import { loginValidation } from '../middleware';
import { AuthRouter, _getUser } from '../auth';
import { FilesystemRouter } from '../filesystem';
import { LcsConfig } from '../../config';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { OptionValues } from 'commander';

dotenv.config();

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
app.use('/storage', FilesystemRouter);

export const start = async (options: OptionValues) => {
  try {
    const PORT: number =
      options.port ||
      Number(LcsConfig.get('dport')) ||
      process.env.PORT ||
      9110;

    const HOST: string =
      options.host || LcsConfig.get('dhost') || process.env.HOST || 'localhost';

    app.listen(PORT, () => {
      console.log(`Server listening on http://${HOST}:${PORT}`);
    });
  } catch (error) {
    await handleError(error);
  }
};
