import { SigninDto, SignupDto, UserDto } from './dto';
import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import * as argon from 'argon2';
import { BlackList, UserEntity } from '../../../lib/db';
import { createUserDirectory, hashPassword, signToken } from '../../utils';
import { ForbiddenException, NotFoundException } from '../../../lib/error';

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const dto: SignupDto = req.body;
  const hash = await hashPassword(dto.password);

  const users = await UserEntity.findAll({
    where: {
      email: dto.email,
    },
  });

  if (users.length !== 0) {
    return next(new ForbiddenException());
  }

  const userDto: UserDto = {
    uuid: uuidv4(),
    username: dto.username,
    email: dto.email,
    password: hash,
  };

  const user = await UserEntity.create(userDto);
  await createUserDirectory(userDto.uuid);

  return res.status(201).json({ user });
};

export const signin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const dto: SigninDto = req.body;

  const user = await UserEntity.findOne({
    where: {
      email: dto.email,
    },
  });

  if (!user) {
    return next(new NotFoundException());
  }

  const pwMatch = await argon.verify(user.password, dto.password);

  if (!pwMatch) {
    return next(new NotFoundException());
  }

  const expToken = user.token;

  if (expToken) {
    await BlackList.create({
      token: `Bearer ${expToken.toString()}`,
    });
  }

  const authentication_token = await signToken(user);

  await user
    .set({
      token: authentication_token,
    })
    .save();

  return res.status(200).json({ authentication_token });
};
