import { handleServerError } from '../../utils';
import { LcsConfig } from '../../../config';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { db, tableName } from '../../../db';
import { UserDto } from '../../auth/dto';
import path from 'path';

declare module 'express-serve-static-core' {
  interface Request {
    user: JwtPayload;
  }
}

export const extractToken = (header: string): string => {
  const parts = header.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    throw new Error('Invalid authorization header format.');
  }

  return parts[1];
};

const verifyToken = async (
  token: string,
  jwt_key: string,
): Promise<JwtPayload> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, jwt_key, (error, decoded) => {
      if (error) {
        reject(error);
      }
      resolve(decoded as JwtPayload);
    });
  });
};

const checkLastlogin = async (user: JwtPayload) => {
  const userRow = path.join(tableName, user.email);
  const userDB: UserDto = await db.getObject<UserDto>(userRow);

  const jti = user.jti;
  const userJti = userDB.jti;

  if (jti === userJti) {
    const jwt_iat = user.iat?.toString();
    const lastLogin = userDB.lastLogin;

    if (jwt_iat !== lastLogin) {
      throw new Error();
    }

    return true;
  }

  throw Error();
};

export const loginValidation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const jwt_key = LcsConfig.get('jwtkey') || process.env.SECRET_KEY;
  if (!jwt_key) {
    throw new Error(
      `No jwt_key for authentication provided. Run lcs config --jwtkey=<key>`,
    );
  }

  try {
    const header = req.headers.authorization;
    if (!header) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }

    const token = extractToken(header);

    req.user = await verifyToken(token, jwt_key);

    await checkLastlogin(req.user);

    next();
  } catch (error) {
    await handleServerError(error, 403, res, 'Login session expired.');
  }
};
