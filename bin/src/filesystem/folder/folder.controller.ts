import { loginValidation } from '../../middleware';
import { listdir, makedir, removedir, move } from './folder.service';
import express from 'express';

export const FolderRouter = express.Router();

FolderRouter.use(loginValidation);
FolderRouter.get('/cmd/ls', listdir);
FolderRouter.post('/cmd/md', makedir);
FolderRouter.put('/cmd/mv', move);
FolderRouter.delete('/cmd/rmrf', removedir);
