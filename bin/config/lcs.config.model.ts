import { ConfigType } from './lcs.config';
import * as fs from 'fs';
import { configPath } from './lcs.pathes';

export class LcsConfig {
  static get(key: keyof ConfigType) {
    try {
      const config = fs.readFileSync(configPath);
      return JSON.parse(config.toString())[key];
    } catch (error) {
      return false;
    }
  }
}
