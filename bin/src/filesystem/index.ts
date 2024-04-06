import os from 'os';
import path from 'path';

export * from './file/file.model';
export * from './folder/folder.service';
export const storageRoot = path.join(os.homedir(), '.lcs', 'storage');
