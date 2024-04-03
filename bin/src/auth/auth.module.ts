import express from 'express';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { signinValidation, signupValidation } from '../middleware';

export const AuthModule = express.Router();
const authController = new AuthController(new AuthService());

AuthModule.post('/signup', signupValidation, authController.singup);
AuthModule.post('/signin', signinValidation, authController.signin);
