import { File } from '../models';
import { NextFunction, Request, Response } from 'express';
import node_path from 'path';
import * as fs from 'fs/promises';
import { storagePath } from '../../../lib/config';
import { handleErrorSync, isExists } from '@stlib/utils';
import { BadRequestException } from '../../../lib/error';

export const read = async (req: Request, res: Response, next: NextFunction) => {
  const uuid = req.user.sub!;
  const { path } = req.body;

  const filepath = node_path.join(storagePath, uuid, path);
  const fileExists = await isExists(filepath);

  if (!fileExists) {
    return next(new BadRequestException('cat: No such file or directory'));
  }

  const stats = await fs.stat(filepath);

  if (stats.isDirectory()) {
    return next(new BadRequestException('cat: Target is a directory'));
  }

  const content = await File.read(filepath);

  return res.status(200).json({ content });
};

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const uuid = req.user.sub!;
  const { content, path } = req.body;

  const filepath = node_path.join(storagePath, uuid, path);
  const cuttedFilepath = filepath.slice(
    0,
    -node_path.basename(filepath).length,
  );
  const pathExists = await isExists(cuttedFilepath);

  if (!pathExists) {
    return next(new BadRequestException('touch: No such file or directory'));
  }

  const file = new File(content);
  await file.create(filepath);

  return res.status(201).json({ message: 'File created.' });
};

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const uuid = req.user.sub!;
  const { path } = req.body;

  const filePath = node_path.join(storagePath, uuid, path);
  const fileExists = await isExists(filePath);

  if (!fileExists) {
    return next(new BadRequestException('rm: The target path does not exist.'));
  }

  await File.remove(filePath);

  return res.status(200).json({ message: 'File removed.' });
};

export const download = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const uuid = req.user.sub!;
  const { path } = req.body;

  const filePath = node_path.join(storagePath, uuid, path);
  const fileExists = await isExists(filePath);

  if (!fileExists) {
    return next(new BadRequestException('download: No such file or directory'));
  }

  return res.download(filePath, (error) => {
    handleErrorSync(error);
  });
};
