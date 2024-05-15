import { Sequelize } from 'sequelize';
import { config, dbPath } from '../config';
import { UserEntity } from './entity/user.entity';
import { handleErrorSync } from '@stlib/utils';

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
  try {
    await sequelize.authenticate();
    await UserEntity.sync({ alter: true });
  } catch (error) {
    handleErrorSync(error, { throw: true });
  }
})();
