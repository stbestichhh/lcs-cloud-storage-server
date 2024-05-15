import { Sequelize } from 'sequelize';
import { config, dbPath } from '../config';
import { UserEntity } from './entity/user.entity';

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

(async () => {
  await UserEntity.sync({ alter: true });
})();
