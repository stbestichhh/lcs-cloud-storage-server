#! /usr/bin/env node
import { program } from 'commander';
import { configure } from '../../config';

program
  .name('lcs')
  .version('0.0.1-beta.1')
  .description('Local cloud storage server with authentication.');

program
  .option('-p, --port <port>', 'Tell server which port to use.')
  .option('-h, --host <host>', 'Tell server which host to use.')
  .option('-l, --log', 'Log every error to logfile.')
  .allowUnknownOption();

program
  .command('config')
  .alias('cfg')
  .description('Define a default config for the server.')
  .option('--dhost <dhost>', 'default server host')
  .option('--dport <dport>', 'default server port')
  .option('--jwtkey <jwtkey>', 'define jwt key to sign tokens')
  .option('--dbname <dbname>', 'define name for users database')
  .allowUnknownOption()
  .action(async (options) => {
    await configure(options);
  });

program.action(() => {});

program.parse(process.argv);

export const options = program.opts();
