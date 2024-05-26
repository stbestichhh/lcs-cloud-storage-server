import * as fs from 'fs/promises';
import multer from 'multer';
import node_path from 'path';
import { storagePath } from '../../lib/config';

const storage = multer.diskStorage({
  destination: async (req, _file, callback) => {
    const uuid = req.user.sub!;
    const { path } = req.body;

    const uploaddir = node_path.join(storagePath, uuid, path ?? '');

    await fs.mkdir(uploaddir, { recursive: true });
    callback(null, uploaddir);
  },
  filename: (_req, file, callback) => {
    callback(null, file.originalname);
  },
});

export const upload = multer({ storage });
