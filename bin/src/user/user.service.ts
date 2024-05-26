import { NextFunction, Request, Response } from 'express';
import { BlackList, UserEntity } from '../../lib/db';
import { EditUserDto } from './dto';
import { hashPassword } from '../utils';
import { ForbiddenException } from '../../lib/error';

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const uuid = req.user.sub!;

  const user = await UserEntity.findOne({
    where: {
      uuid,
    },
  });

  if (!user) {
    return next(new ForbiddenException());
  }

  return res.status(200).json({ user });
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const uuid = req.user.sub!;
  const dto: EditUserDto = req.body;

  const user = await UserEntity.findOne({
    where: {
      uuid,
    },
  });

  if (!user) {
    return next(new ForbiddenException());
  }

  const hash = dto.password ? await hashPassword(dto.password) : user.password;

  const updateData = {
    username: dto.username ? dto.username : user.username,
    password: hash,
  };

  user.set(updateData);
  await user.save();

  await BlackList.create({
    token: req.headers.authorization!,
  });

  return res.status(200).json({ user });
};
