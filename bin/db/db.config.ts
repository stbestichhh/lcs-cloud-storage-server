import * as os from 'os';
import path from 'path';
import { LcsConfig } from '../config';
import { JsonDB, Config } from 'node-json-db';
import dotenv from 'dotenv';

dotenv.config();

const dbName = LcsConfig.get('dbname') || process.env.DB_NAME || 'lcs_db';
const dbPath = path.join(os.homedir(), '.lcs', dbName);
const saveOnPush = true;

const config = new Config(dbPath, saveOnPush);

export const db = new JsonDB(config);
export const tableName = '/users';
