#! /usr/bin/env node
import express from 'express';
import { program } from 'commander';
import dotenv from 'dotenv';
import cors from 'cors';
import { limiter } from './src/utils';
import { AuthRouter } from './src/auth/auth.module';
import { loginValidation } from './src/middleware';
import { _getUser } from './src/auth/auth.controller';

dotenv.config();

export const app = express();
app.use(express.json());
app.use(cors());
app.use(limiter);

program
  .version('0.0.1-alpha.1')
  .description('Local cloud storage with authentication')
  .option('-p, --port <port>', 'Tell program which port to use.')
  .allowUnknownOption()
  .parse(process.argv);

const options = program.opts();

const PORT: number = options.port || process.env.PORT || 9110;
const HOST: string = process.env.HOST || 'localhost';

app.get('/', (_req, res) => {
  res.sendStatus(200);
});

app.get('/protected', loginValidation, (_req, res) => {
  res.sendStatus(200);
});

app.get('/me', loginValidation, _getUser);
app.use('/auth', AuthRouter);

export const server = app.listen(PORT, () => {
  console.log(`Server listening on http://${HOST}:${PORT}`);
});
