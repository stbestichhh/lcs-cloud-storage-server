import { ConfigType } from './lcs.config';
import * as fs from 'fs';
import { configPath } from './lcs.pathes';
import { handleErrorSync } from '../src/utils';

export class LcsConfig {
  static get(key: keyof ConfigType) {
    try {
      const config = fs.readFileSync(configPath);
      const configVar = JSON.parse(config.toString())[key];
      return checkKey(configVar, key);
    } catch (error) {
      handleErrorSync(error);
    }
  }
}

const checkKey = (configVar: string, key: keyof ConfigType) => {
  if (configVar === undefined) {
    throw new Error(`${key} is missing in config file. Run lcs config --${key}=value to define it.`);
  }
  return configVar;
}
