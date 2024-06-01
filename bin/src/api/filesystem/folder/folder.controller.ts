import { loginValidation } from '../../../middleware';
import { FolderService } from './folder.service';
import express from 'express';
import { directoryServiceValidation } from '../../../middleware/validation/folder.validation';

export const FolderRouter = express.Router();

FolderRouter.use(loginValidation);
FolderRouter.post('', directoryServiceValidation, FolderService.handleCommand)
