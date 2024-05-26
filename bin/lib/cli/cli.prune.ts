import { OptionValues } from 'commander';
import { configPath, storagePath } from '../config';
import path from 'path';
import os from 'os';
import { File, Folder } from '../../src/filesystem';
import { handleErrorSync } from '@stlib/utils';
import { sequelize } from '../db';

export const serverPrune = async (options: OptionValues) => {
  try {
    await clearConfig(options);
    await clearStorage(options);
    await clearDatabase(options);
    await clearAllData(options);
  } catch (error) {
    handleErrorSync(error, { throw: true });
  }
};

const clearConfig = async (options: OptionValues) => {
  if (options.config) {
    await File.remove(configPath);
    return console.log('Config has been cleared.');
  }
};

const clearStorage = async (options: OptionValues) => {
  if (options.storage) {
    await Folder.remove(storagePath);
    return console.log('Storage has been cleared.');
  }
};

const clearDatabase = async (options: OptionValues) => {
  if (options.database) {
    await sequelize.drop();
    return console.log('User database has been cleared');
  }
};

const clearAllData = async (options: OptionValues) => {
  const rootDir = path.join(os.homedir(), '.lcs-cloud-storage');
  const configDir = path.join(os.homedir(), '.config', 'lcs-cloud-storage');

  if (options.all) {
    await Folder.remove(rootDir).then(async () => {
      await Folder.remove(configDir);
    });
    return console.log('All data has been cleared.');
  }
};
