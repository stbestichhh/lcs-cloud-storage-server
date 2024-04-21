import path from 'path';
import os from 'os';

export const storageRoot = path.join(os.homedir(), '.lcs-cloud-storage', 'storage');
export const configPath = path.join(os.homedir(), '.config', 'lcs-cloud-storage', 'lcs.config');
export const logfilePath = path.join(os.homedir(), '.lcs-cloud-storage', 'lcs.logs');
