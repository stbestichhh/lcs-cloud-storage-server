import { ConfigType } from './lcs.config';
import * as fs from 'fs';
import { configPath } from './lcs.pathes';

export class LcsConfig {
  static get(key: keyof ConfigType) {
    const config = fs.readFileSync(configPath);
    return Number(JSON.parse(String(config))[key]);
  }
}
