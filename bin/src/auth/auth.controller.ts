import dotenv from 'dotenv';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';

dotenv.config();

export class AuthController {
  constructor(private authService: AuthService) {}
  async singup (req: Request, res: Response) {
    return this.authService.signup(req, res);
  }

  async signin(req: Request, res: Response) {
    return this.authService.signin(req, res);
  }
}
