import * as fs from 'fs/promises';
import { extractPath, FileSystemCommand } from '../utils';
import multer from 'multer';

const storage = multer.diskStorage({
  destination: async (req, _file, callback) => {
    const userDir = req.user.sub;
    if (!userDir) {
      throw Error('Empty user.sub in request.');
    }

    const uploadDir = extractPath(req.path, userDir, FileSystemCommand.Upload);
    await fs.mkdir(uploadDir, { recursive: true });
    callback(null, uploadDir);
  },
  filename: (_req, file, callback) => {
    callback(null, file.originalname);
  },
});

export const upload = multer({ storage });
