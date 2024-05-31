import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import { sequelize } from '../db.config';

export interface BalckListType
  extends Model<
    InferCreationAttributes<BalckListType>,
    InferAttributes<BalckListType>
  > {
  token: string;
  created?: Date;
}

export const BlackList = sequelize.define<BalckListType>(
  'BalckList',
  {
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'blacklist',
    timestamps: true,
    createdAt: 'created',
    updatedAt: 'updated',
  },
);
