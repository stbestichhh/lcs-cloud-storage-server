import path from 'path';
import os from 'os';
import { dbName } from '../db';

export const storagePath = path.join(
  os.homedir(),
  '.lcs-cloud-storage',
  'storage',
);

export const configPath = path.join(
  os.homedir(),
  '.config',
  'lcs-cloud-storage',
  'lcs.config.json',
);

export const logfilePath = path.join(
  os.homedir(),
  '.lcs-cloud-storage',
  'lcs.logs',
);

export const dbPath = path.join(os.homedir(), '.lcs-cloud-storage', dbName);
