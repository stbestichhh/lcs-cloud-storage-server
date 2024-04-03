import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { handleError } from '../utils';
import { db, tableName } from '../../db';
import { UserDto } from './dto';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

export class AuthService {
  async signup(req: Request, res: Response) {
    const password = req.body.password;
    const hashRounds = 10;
    bcrypt.hash(
      password,
      hashRounds,
      async (err: Error | undefined, hash: string) => {
        await handleError(err, 500, res);

        const user: UserDto = {
          uuid: uuidv4(),
          name: req.body.name,
          email: req.body.email,
          password: hash,
        };

        const userRow = path.join(tableName, user.email);
        await db.push(userRow, user, false);

        const authentication_token = await this.signToken(user);
        return res.status(200).json({ authentication_token });
      },
    );
  }

  async signin(req: Request, res: Response) {
    const email = req.body.email;
    const password = req.body.password;
    const userRow = path.join(tableName, email);
    const user: UserDto = await db.getObject<UserDto>(userRow);
    bcrypt.compare(password, user.password, async (error) => {
      await handleError(error, 500, res);
      const authentication_token = await this.signToken(user);
      return res.status(200).json({ authentication_token });
    });
  }

  async signToken(user: UserDto) {
    const payload: JwtPayload = {
      sub: user.uuid,
    };

    const jwt_key = process.env.SECRET_KEY || 'super_secret';
    return jwt.sign(payload, jwt_key, { expiresIn: '30d' });
  }
}
