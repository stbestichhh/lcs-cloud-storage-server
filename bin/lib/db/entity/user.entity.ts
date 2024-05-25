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
  jti?: string;
  lastLogin?: string;
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
    jti: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    lastLogin: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created',
    updatedAt: 'updated',
  },
);
