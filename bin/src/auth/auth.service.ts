import path from 'path';
import { LcsConfig, storageRoot } from '../../config';
import { handleServerError } from '../utils';
import { db, tableName } from '../../db';
import { Folder } from '../filesystem';
import { LoginData, UserDto } from './dto';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

export const getUser = async (req: Request, res: Response) => {
  return res.status(200).json(req.user);
};

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const hash = await hashPassword(password);

    const userDto: UserDto = {
      uuid: uuidv4(),
      name,
      email,
      password: hash,
    };

    const userRow = path.join(tableName, userDto.email);
    const user: UserDto | boolean = await db.getObjectDefault<
      UserDto | boolean
    >(userRow, false);

    if (!user) {
      await db.push(userRow, userDto);
      await createUserDirectory(userDto.uuid);
      return res.status(201).json({ message: 'Successfully signed up.' });
    }

    return res.status(403).json({ error: 'Email already registered.' });
  } catch (error) {
    await handleServerError(error, 500, res);
  }
};

export const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const userRow = path.join(tableName, email);
    const user: UserDto = await db.getObject<UserDto>(userRow);

    const match = await bcrypt.compare(password, user.password);

    if (match) {
      const { authentication_token, jti } = await signToken(user);

      const loginData: LoginData = {
        jti,
        lastLogin: Date.now().toString().slice(0, -3),
      }

      await db.push(userRow, loginData, false);

      return res
        .status(200)
        .json({ message: 'Successfully signed in.', authentication_token });
    }

    return res.status(403).json({ Error: 'Credentials are incorrect.' });
  } catch (error) {
    await handleServerError(error, 403, res, 'Credentials are incorrect.');
  }
};

export const signToken = async (user: UserDto) => {
  const payload: JwtPayload = {
    sub: user.uuid,
    email: user.email,
    jti: uuidv4(),
  };

  const jwt_key = LcsConfig.get('jwtkey') || process.env.SECRET_KEY;
  if (!jwt_key) {
    throw Error(
      `No jwt_key for authentication provided. Run lcs config --jwtkey=<key>`,
    );
  }
  return { authentication_token: jwt.sign(payload, jwt_key, { expiresIn: '30d' }), jti: payload.jti };
};

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  return await bcrypt.hash(password, salt);
};

export const createUserDirectory = async (
  name: string,
): Promise<string | undefined> => {
  return await new Folder(name).create(storageRoot);
};
