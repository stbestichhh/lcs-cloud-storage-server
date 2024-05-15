import { loginValidation } from '../../middleware';
import {
  listdir,
  makedir,
  removedir,
  move,
} from './folder.service';
import express from 'express';

export const FolderRouter = express.Router();

FolderRouter.use(loginValidation);
FolderRouter.use('/$cmd')
FolderRouter.get('/ls', listdir);
FolderRouter.post('/md', makedir);
FolderRouter.put('/mv', move);
FolderRouter.delete('/rmrf', removedir);
