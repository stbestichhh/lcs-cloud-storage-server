import { LoginData, SigninDto, SignupDto, UserDto } from './dto';
import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import * as argon from 'argon2';
import { UserEntity } from '../../lib/db';
import { handleError } from '@stlib/utils';
import { createUserDirectory, hashPassword, signToken } from '../utils';

export const signup = async (req: Request, res: Response) => {
    const dto: SignupDto = req.body;
    const hash = await hashPassword(dto.password);

    const users = await UserEntity.findAll({
      where: {
        email: dto.email,
      },
    })

    if (users.length !== 0) {
      return res.status(403).json({ error: 'Forbidden.' });
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

export const signin = async (req: Request, res: Response) => {
  try {
    const dto: SigninDto = req.body;

    const user = await UserEntity.findOne({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'Credentials are incorrect.' });
    }

    const pwMatch = await argon.verify(user.password, dto.password);

    if (!pwMatch) {
      return res.status(404).json({ error: 'Credentials are incorrect.' });
    }

    const { authentication_token, jti } = await signToken(user);

    const loginData: LoginData = {
      jti,
      lastLogin: Date.now().toString().slice(0, -3),
    };

    user.set(loginData);
    await user.save();

    return res.status(200).json({ authentication_token });
  } catch (error) {
    await handleError(error, () => {
      res.status(500).json({ error: 'Internal server error.' });
    });
  }
};
