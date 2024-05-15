import { configPath } from './index';
import { OptionValues } from 'commander';
import { Config, handleErrorSync } from '@stlib/utils';

export type ConfigType = {
  dport: string | number;
  dhost: string | number;
  jwtkey: string | number;
  dbname: string | number;
};

export const config = new Config(configPath, {});

export const configure = async (options: OptionValues) => {
  try {
    await config.write(options);
  } catch (error) {
    handleErrorSync(error, { throw: true });
  }
};
