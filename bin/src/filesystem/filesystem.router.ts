import express from 'express';
import { loginValidation } from '../middleware';
import { listdir, makedir, removedir, renamedir } from './folder/folder.controller';

export const FilesystemRouter = express.Router();

FilesystemRouter.use(loginValidation);

// Folder routes
FilesystemRouter.get('/ls/*', listdir);
FilesystemRouter.post('/md/*', makedir);
FilesystemRouter.put('/mv/*', renamedir);
FilesystemRouter.delete('/rmrf/*', removedir);

// File routes
FilesystemRouter.post('/upload/*');
FilesystemRouter.delete('/rm/*');
