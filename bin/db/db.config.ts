import { Sequelize } from 'sequelize';
import { config, dbPath } from '../config';

export const dbName = (
  config.get('dbname') ||
  process.env.DB_NAME ||
  'lcs_db.sql'
).toString();

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: false,
});
