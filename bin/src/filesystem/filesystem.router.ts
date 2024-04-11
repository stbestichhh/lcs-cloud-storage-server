import express from 'express';
import { loginValidation } from '../middleware';
import {
  _listdir,
  _makedir,
  _removedir,
  _move,
} from './folder/folder.controller';
import { _download, _remove } from './file/file.controller';
import { upload } from './filesystem.config';

export const FilesystemRouter = express.Router();

FilesystemRouter.use(loginValidation);

// Folder routes
FilesystemRouter.get('/ls/*', _listdir);
FilesystemRouter.post('/md/*', _makedir);
FilesystemRouter.put('/mv/*', _move);
FilesystemRouter.delete('/rmrf/*', _removedir);

// File routes
FilesystemRouter.post('/upload/*', upload.any(), (_req, res) => {
  return res.status(200).json({ message: 'Uploaded.' });
});
FilesystemRouter.get('/download/*', _download);
FilesystemRouter.delete('/rm/*', _remove);
