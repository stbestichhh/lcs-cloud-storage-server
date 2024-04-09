import path from 'path';
import { storageRoot } from '../filesystem';

export enum fsCommand {
  ls = '/ls/',
  md = '/md',
  mv = '/mv/',
  rm = '/rm/',
  rmrf = '/rmrf/',
  upload = '/upload/',
}

export type fsCommandType =
  | '/ls/'
  | '/md/'
  | '/mv/'
  | '/rm/'
  | '/rmrf/'
  | '/upload/';

export const extractPath = (
  pathUrl: string,
  command: fsCommandType,
  name?: string,
): string => {
  return path.join(
    storageRoot,
    pathUrl.replace(command, ''),
    typeof name === 'string' ? name : '',
  );
};
