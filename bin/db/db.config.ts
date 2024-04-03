import { JsonDB, Config } from 'node-json-db';
import dotenv from 'dotenv';

dotenv.config();

const dbName = process.env.DB_NAME || 'lcs_db';
const saveOnPush = true;

const config = new Config(dbName, saveOnPush);

export const db = new JsonDB(config);
export const tableName = '/users';
