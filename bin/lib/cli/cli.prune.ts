import { OptionValues } from 'commander';
import { configPath, appNames, storagePath, logdirectoryPath } from '../config';
import path from 'path';
import os from 'os';
import { File, Folder } from '../../src/api';
import { handleErrorSync } from '@stlib/utils';
import { sequelize } from '../db';

export const serverPrune = async (options: OptionValues) => {
  try {
    await clearConfig(options);
    await clearStorage(options);
    await clearDatabase(options);
    await clearLogs(options);
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
    return console.log('User database has been cleared.');
  }
};

const clearLogs = async(options: OptionValues) => {
  if(options.logs) {
    await Folder.remove(logdirectoryPath.slice(0, -path.basename(logdirectoryPath).length));
    return console.log('Server logs has been deleted.');
  }
}

const clearAllData = async (options: OptionValues) => {
  const rootDir = path.join(os.homedir(), appNames.rootdir);
  const configDir = path.join(
    os.homedir(),
    appNames.configdir,
    appNames.rootcfgdir,
  );

  if (options.all) {
    await Folder.remove(rootDir);
    await Folder.remove(configDir);

    return console.log('All data has been cleared.');
  }
};
