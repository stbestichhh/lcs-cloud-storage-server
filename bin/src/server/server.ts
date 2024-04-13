import express from 'express';
import cors from 'cors';
import { limiter } from '../utils';
import dotenv from 'dotenv';
import { loginValidation } from '../middleware';
import { _getUser } from '../auth/auth.controller';
import { AuthRouter } from '../auth/auth.module';
import { FilesystemRouter } from '../filesystem/filesystem.router';
import { options } from '../cli';
import { LcsConfig } from '../../config/lcs.config.model';

dotenv.config();

export const app = express();
app.use(express.json());
app.use(cors());
app.use(limiter);

const PORT: number =
  options.port || Number(LcsConfig.get('dport')) || process.env.PORT || 9110;
const HOST: string = LcsConfig.get('dhost') || process.env.HOST || 'localhost';

app.get('/', (_req, res) => {
  res.sendStatus(200);
});

app.get('/protected', loginValidation, (_req, res) => {
  res.sendStatus(200);
});

app.get('/me', loginValidation, _getUser);
app.use('/auth', AuthRouter);
app.use('/storage', FilesystemRouter);

export const server = app.listen(PORT, () => {
  console.log(`Server listening on http://${HOST}:${PORT}`);
});
