import { loginValidation } from '../../../middleware';
import { FileService } from './file.service';
import { upload } from '../multer.config';
import express, { Request, Response } from 'express';
import { fileServiceValidation } from '../../../middleware';

export const FileRouter = express.Router();

FileRouter.use(loginValidation);
FileRouter.post('', fileServiceValidation, FileService.handleCommand);
FileRouter.post('/upload', upload.any(), (req: Request, res: Response) => {
  return res.status(200).json({ message: 'Uploaded.' });
});
