import * as fs from 'fs/promises';
import { OptionValues } from 'commander';
import { handleError } from '../src/utils';
import { PathLike } from 'node:fs';
import { isExists } from '../src/utils/fileExists';
import { configPath } from './index';

export type ConfigType = {
  dport: string;
  dhost: string;
  jwtkey: string;
  dbname: string;
};

export const configure = async (options: OptionValues) => {
  try {
    const configFileExists = await isExists(
      configPath,
      true,
      JSON.stringify(options),
    );
    if (configFileExists) {
      const config: ConfigType = await readConfig(configPath);
      Object.assign(config, options);
      return await writeConfig(configPath, config);
    }
  } catch (error) {
    await handleError(error);
  }
};

export const readConfig = async (configPath: PathLike): Promise<ConfigType> => {
  const data = await fs.readFile(configPath);
  return JSON.parse(data.toString());
};

export const writeConfig = async (
  configPath: PathLike,
  config: ConfigType | OptionValues,
) => {
  return await fs.writeFile(configPath, JSON.stringify(config));
};
