import { handleServerError } from '../../utils';
import { LcsConfig } from '../../../config';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

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

export const loginValidation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const jwt_key = LcsConfig.get('jwtkey') || process.env.SECRET_KEY;
  if (!jwt_key) {
    throw new Error(
      `No jwt_key for authentication provided. Run lcs --config SECRET_KEY=""`,
    );
  }

  try {
    const header = req.headers.authorization;
    if (!header) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }

    const token = extractToken(header);

    req.user = await verifyToken(token, jwt_key);
    next();
  } catch (error) {
    await handleServerError(error, 500, res);
  }
};
