import path from 'path';
import { storagePath } from '../../config';

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
  return path.join(storagePath, userDir, pathUrl.replace(command, ''));
};
