import { Sequelize } from 'sequelize';
import { dbPath } from '../config';
import { handleErrorSync } from '@stlib/utils';

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
};
