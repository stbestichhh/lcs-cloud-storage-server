import { OptionValues } from 'commander';
import { configPath, storagePath } from '../../../config';
import path from 'path';
import os from 'os';
import { handleError } from '../../utils';
import { File, Folder } from '../../filesystem';

export const serverPrune = async (options: OptionValues) => {
  try {
    await clearConfig(options);
    await clearStorage(options);
    await clearAllData(options);

    return console.log('Data has been cleared.');
  } catch (error) {
    await handleError(error);
  }
};

const clearConfig = async (options: OptionValues) => {
  if (options.config) {
    await File.remove(configPath);
  }
};

const clearStorage = async (options: OptionValues) => {
  if (options.storage) {
    await Folder.remove(storagePath);
  }
};

const clearAllData = async (options: OptionValues) => {
  const rootDir = path.join(os.homedir(), '.lcs-cloud-storage');
  const configDir = path.join(os.homedir(), '.config', 'lcs-cloud-storage');

  if (options.all) {
    await Folder.remove(rootDir).then(() => {
      Folder.remove(configDir);
    });
  }
};
