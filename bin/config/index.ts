import path from 'path';
import os from 'os';

export * from './lcs.config';

export const storageRoot = path.join(os.homedir(), '.lcs', 'storage');
export const configPath = path.join(os.homedir(), '.lcs', '.lcs.config');
