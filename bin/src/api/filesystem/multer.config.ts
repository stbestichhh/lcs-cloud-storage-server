import * as fs from 'fs/promises';
import multer from 'multer';
import { getFilePath } from '../../utils/getFilePath';

const storage = multer.diskStorage({
  destination: async (req, _file, callback) => {
    const uuid = req.user.sub!;
    const { path: relativePath } = req.body;

    const uploadDirectory = getFilePath(uuid, relativePath || '');

    await fs.mkdir(uploadDirectory, { recursive: true });
    callback(null, uploadDirectory);
  },
  filename: (_req, file, callback) => {
    callback(null, file.originalname);
  },
});

export const upload = multer({ storage });
