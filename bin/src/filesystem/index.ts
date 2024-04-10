import os from 'os';
import path from 'path';

export * from './models/folder.model';
export const storageRoot = path.join(os.homedir(), '.lcs', 'storage');
