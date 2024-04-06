import express from 'express';
import { loginValidation, signinValidation, signupValidation } from '../middleware';
import { _getUser, _signin, _signup } from './auth.controller';

export const AuthRouter = express.Router();

AuthRouter.post('/signup', signupValidation, _signup);
AuthRouter.post('/signin', signinValidation, _signin);
AuthRouter.get('/me', loginValidation, _getUser);
