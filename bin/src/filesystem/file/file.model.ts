export interface FileModel {
  name: string;
  content: string;

  read: (path: string) => string;
  update: (path: string) => void;
  delete: (path: string) => void;
}
