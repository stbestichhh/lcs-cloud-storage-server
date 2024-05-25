import { OptionValues } from 'commander';
import { handleErrorSync } from '@stlib/utils';
import { config } from '../config';

export const configure = async (options: OptionValues) => {
  try {
    await config.write(options);
  } catch (error) {
    handleErrorSync(error, { throw: true });
  }
};
