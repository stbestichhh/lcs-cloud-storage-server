import jwt, { JsonWebTokenError, JwtPayload } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { config } from '../../../lib/config';
import { UserEntity } from '../../../lib/db';
import { UnauthorizedExceptions } from '../../../lib/error';

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

  const { jti, iat } = user;
  const { jti: userJti, lastLogin } = user_entity;

  if (jti !== userJti || iat?.toString() !== lastLogin) {
    return undefined;
  }

  return true;
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
      return next(new UnauthorizedExceptions());
    }

    const token = await extractToken(authorization);

    req.user = await verifyToken(token, jwt_key);

    const check = await checkLastlogin(req.user);

    if (check) {
      return next();
    }

    return next(new UnauthorizedExceptions());
  } catch (error) {
    return next(error);
  }
};
