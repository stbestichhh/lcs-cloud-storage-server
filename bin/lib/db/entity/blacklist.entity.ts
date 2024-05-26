import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import { sequelize } from '../db.config';

export interface BalckListType
  extends Model<InferCreationAttributes<BalckListType>, InferAttributes<BalckListType>> {
  token: string;
}

export const BlackList = sequelize.define<BalckListType>(
  'BalckList',
  {
    token: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    tableName: 'blacklist',
    timestamps: true,
    createdAt: 'created',
    updatedAt: 'updated',
  },
);
