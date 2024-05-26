import { Request, Response } from 'express';
import { UserEntity } from '../../lib/db';
import { EditUserDto } from './dto';
import { handleErrorSync } from '@stlib/utils';
import { hashPassword } from '../utils';

export const getUser = async (req: Request, res: Response) => {
  try {
    const uuid = req.user.sub;

    const user = await UserEntity.findOne({
      where: {
        uuid,
      },
    });

    if (!user) {
      return res.status(400).json({ error: 'Forbidden.' });
    }

    return res.status(200).json({ user });
  } catch (error) {
    handleErrorSync(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const uuid = req.user.sub;
    const dto: EditUserDto = req.body;

    const user = await UserEntity.findOne({
      where: {
        uuid,
      },
    });

    if (!user) {
      return res.status(400).json({ error: 'Forbidden.' });
    }

    const hash = dto.password
      ? await hashPassword(dto.password)
      : user.password;

    const updateData = {
      username: dto.username ? dto.username : user.username,
      password: hash,
      lastLogin: Date.now().toString().slice(0, -3),
    };

    user.set(updateData);
    await user.save();

    return res.status(200).json({ user });
  } catch (error) {
    handleErrorSync(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};
