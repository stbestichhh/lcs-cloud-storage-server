import express from 'express';
import { program } from 'commander';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

program.version('0.0.1-alpha', '-v, --version', 'Current version');
program.option('-p, --port <port>', 'Tell program which port to use.').parse(process.argv);

const options = program.opts();

const PORT: number = options.port || process.env.PORT || 9110;
const HOST: string = process.env.HOST || 'localhost';

app.listen(PORT, () => {
  console.log(`Server listening on http://${HOST}:${PORT}`);
});
