import path from 'path';
import { storageRoot } from '../filesystem';

export enum fsCommand {
  ls = '/ls/',
  md = '/md/',
  mv = '/mv/',
  rm = '/rm/',
  rmrf = '/rmrf/',
  upload = '/upload/',
  download = '/download/'
}

export type fsCommandType =
  | '/ls/'
  | '/md/'
  | '/mv/'
  | '/rm/'
  | '/rmrf/'
  | '/upload/'
  | '/download/';

export const extractPath = (
  pathUrl: string,
  userDir: string,
  command: fsCommandType,
  name?: string,
): string => {
  return path.join(
    storageRoot,
    userDir,
    pathUrl.replace(command, ''),
    typeof name === 'string' ? name : '',
  );
};
