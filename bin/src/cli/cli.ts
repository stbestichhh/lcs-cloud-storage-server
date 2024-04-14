#! /usr/bin/env node
import { OptionValues, program } from 'commander';
import { configure } from '../../config';
import { start } from '../server';

program
  .name('lcs')
  .version('0.0.1-beta.1')
  .description('Local cloud storage server with authentication.')
  .allowUnknownOption();

program.option('-l, --log', 'Log every error to logfile.');

program
  .command('config')
  .alias('cfg')
  .description('Define a default config for the server.')
  .option('--dhost <dhost>', 'default server host')
  .option('--dport <dport>', 'default server port')
  .option('--jwtkey <jwtkey>', 'define jwt key to sign tokens')
  .option('--dbname <dbname>', 'define name for users database')
  .action(async (options) => {
    await configure(options);
  });

program
  .command('server')
  .alias('run')
  .description('Start the local cloud storage server.')
  .option('-p, --port <port>', 'Tell server which port to use.')
  .option('-h, --host <host>', 'Tell server which host to use.')
  .action(async (options) => {
    await start(options);
  });

program.action(() => {
  return console.log('Run lcs --help to see usage instructions.');
});

program.parse(process.argv);

export const options: OptionValues = program.opts();
