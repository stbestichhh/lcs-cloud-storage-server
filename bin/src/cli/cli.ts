#! /usr/bin/env node
import { program } from 'commander';

program
  .version('0.0.1-alpha.beta')
  .description('Local cloud storage with authentication')
  .option('-p, --port <port>', 'Tell program which port to use.')
  .allowUnknownOption()
  .parse(process.argv);

export const options = program.opts();
