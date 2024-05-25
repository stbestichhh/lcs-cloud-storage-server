import { Sequelize } from 'sequelize';
import { config } from '../config';
import { handleErrorSync } from '@stlib/utils';
import path from 'path';
import os from 'os';

export const dbName =
  (config.get('dbname') ||
  process.env.DB_NAME ||
  'lcs_db.sql').toString();

export const dbPath = path.join(os.homedir(), '.lcs-cloud-storage', dbName);

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: false,
});

export const connectDb = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
  } catch (error) {
    handleErrorSync(error, { throw: true });
  }
}
