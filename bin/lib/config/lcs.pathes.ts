import path from 'path';
import os from 'os';

export const appNames = {
  rootdir: '.lcs-cloud-storage',
  rootcfgdir: 'lcs-cloud-storage',
  configdir: '.config',
  storagedir: 'storage',
  configfile: 'lcs.config',
  logsfile: 'lcs.log',
  dbname: 'lcs_db.sql',
};

export const storagePath = path.join(
  os.homedir(),
  appNames.rootdir,
  appNames.storagedir,
);

export const configPath = path.join(
  os.homedir(),
  appNames.configdir,
  appNames.rootcfgdir,
  appNames.configfile,
);

export const logfilePath = path.join(
  os.homedir(),
  appNames.rootdir,
  appNames.logsfile,
);

export const dbPath = path.join(
  os.homedir(),
  appNames.rootdir,
  appNames.dbname,
);
