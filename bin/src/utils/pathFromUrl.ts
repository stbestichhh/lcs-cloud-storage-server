import path from 'path';
import { storageRoot } from '../../config';

export enum FileSystemCommand {
  List = '/ls/',
  MakeDirectory = '/md/',
  Move = '/mv/',
  Remove = '/rm/',
  RemoveRecursive = '/rmrf/',
  Upload = '/upload/',
  Download = '/download/',
}

export type FileSystemCommandType =
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
  command: FileSystemCommandType,
): string => {
  return path.join(storageRoot, userDir, pathUrl.replace(command, ''));
};
