import { ConfigType } from './lcs.config';
import * as fs from 'fs';
import { configPath } from './lcs.pathes';
import { handleErrorSync } from '../src/utils';

export class LcsConfig {
  static get(key: keyof ConfigType) {
    try {
      const config = fs.readFileSync(configPath);
      return JSON.parse(String(config))[key];
    } catch (error) {
      handleErrorSync(error, 'No config provided. Run lcs help config.');
    }
  }
}
