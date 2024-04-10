import express from 'express';
import { loginValidation } from '../middleware';
import {
  _listdir,
  _makedir,
  _removedir,
  _move,
} from './folder/folder.controller';

export const FilesystemRouter = express.Router();

FilesystemRouter.use(loginValidation);

// Folder routes
FilesystemRouter.get('/ls/*', _listdir);
FilesystemRouter.post('/md/*', _makedir);
FilesystemRouter.put('/mv/*', _move);
FilesystemRouter.delete('/rmrf/*', _removedir);

// File routes
FilesystemRouter.post('/upload/*');
FilesystemRouter.delete('/rm/*');
