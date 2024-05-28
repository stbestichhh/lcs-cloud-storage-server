import { loginValidation } from '../../../middleware';
import { create, download, read, remove } from './file.service';
import { upload } from '../multer.config';
import express from 'express';

export const FileRouter = express.Router();

FileRouter.use(loginValidation);
FileRouter.get('/cmd/cat', read);
FileRouter.post('/cmd/touch', create);
FileRouter.delete('/cmd/rm', remove);
FileRouter.get('/cmd/dl', download);
FileRouter.post('/cmd/ul', upload.any(), (_req, res) => {
  return res.status(200).json({ message: 'Uploaded.' });
});
