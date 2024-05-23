import { loginValidation } from '../../middleware';
import { create, download, read, remove } from './file.service';
import { upload } from '../multer.config';
import express from 'express';

export const FileRouter = express.Router();

FileRouter.use(loginValidation);
FileRouter.use('/$cmd')
FileRouter.get('/cat', read);
FileRouter.post('/touch', create);
FileRouter.delete('/rm', remove);
FileRouter.get('/dl', download);
FileRouter.post('/ul', upload.any(), (_req, res) => {
  return res.status(200).json({ message: 'Uploaded.' });
});
