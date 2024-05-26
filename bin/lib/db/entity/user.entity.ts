import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import { sequelize } from '../db.config';

export interface UserType
  extends Model<InferCreationAttributes<UserType>, InferAttributes<UserType>> {
  uuid: string;
  username: string;
  email: string;
  password: string;
  token?: string;
}

export const UserEntity = sequelize.define<UserType>(
  'User',
  {
    uuid: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created',
    updatedAt: 'updated',
  },
);
