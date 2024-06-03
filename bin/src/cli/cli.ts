import { start } from '../server';
import { OptionValues, program } from 'commander';
import { serverPrune, configure } from '../../lib/cli';
import { clearBlacklistJob } from '../scheduler';

program
  .name('lcs')
  .version('1.0.2')
  .description('Local cloud storage server with authentication')
  .option('--log', 'log every error to logfile.')
  .allowUnknownOption();

program
  .command('config')
  .alias('cfg')
  .description('Define a default config for the server')
  .option('--dhost <dhost>', 'define default server host')
  .option('--dport <dport>', 'define default server port')
  .option('--jwtkey <jwtkey>', 'define jwt key to sign tokens')
  .option(
    '--authexp <time>',
    'define a life time for login sessions. Format: "2 days", "10h", "7d"',
  )
  .action(async (options) => {
    clearBlacklistJob.stop();
    await configure(options);
  });

program
  .command('server')
  .alias('run')
  .description('Start the local cloud storage server')
  .option('-p, --port <port>', 'tell server which port to use')
  .option('-h, --host <host>', 'tell server which host to use')
  .option('-https, --secure [days]', 'tell server to use https protocol')
  .action(async (options) => {
    await start(options);
  });

program
  .command('prune')
  .description('Clear server data and delete it')
  .option('-c, --config', 'clear server config')
  .option('-s, --storage', 'clear server storage')
  .option('-db, --database', 'drop user database')
  .option('-l, --logs', 'delete server logs')
  .option('-a, --all', 'clear all server data from system')
  .action(async (options) => {
    clearBlacklistJob.stop();
    await serverPrune(options);
  });

program.action(() => {
  clearBlacklistJob.stop();
  console.log('Run lcs --help to see usage instructions.');
});

program.parse(process.argv);

export const options: OptionValues = program.opts();
