import jwt, { JsonWebTokenError, JwtPayload } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { config } from '../../../lib/config';
import { UserEntity } from '../../../lib/db';
import { handleErrorSync } from '@stlib/utils';

declare module 'express-serve-static-core' {
  interface Request {
    user: JwtPayload;
  }
}

export const extractToken = (header: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const parts = header.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      const error = new Error('Invalid authorization header format.');
      reject(error);
    }

    resolve(parts[1]);
  });
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
  const user_entity = await UserEntity.findOne({
    where: {
      uuid: user.sub,
    },
  });

  if (!user_entity) {
    return undefined;
  }

  const jti = user.jti;
  const userJti = user_entity.jti;

  if (jti === userJti) {
    const jwt_iat = user.iat?.toString();
    const lastLogin = user_entity.lastLogin;

    if (jwt_iat !== lastLogin) {
      return undefined;
    }

    return true;
  }

  return undefined;
};

export const loginValidation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const jwt_key = (config.get('jwtkey') || process.env.SECRET_KEY)?.toString();

  if (!jwt_key) {
    throw new JsonWebTokenError(
      `No jwt_key for authentication provided. Run lcs config --jwtkey=<key>`,
    );
  }

  try {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }

    const token = await extractToken(authorization);

    req.user = await verifyToken(token, jwt_key);

    const check = await checkLastlogin(req.user);

    if (check) {
      return next();
    }

    return res.status(401).json({ error: 'Login session expired.' });
  } catch (error) {
    handleErrorSync(error);
    return res.status(500).json({ error });
  }
};
