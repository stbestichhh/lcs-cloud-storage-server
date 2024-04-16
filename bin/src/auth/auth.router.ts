import { signinValidation, signupValidation } from '../middleware';
import { _signin, _signup } from './auth.controller';
import express from 'express';

export const AuthRouter = express.Router();

AuthRouter.post('/signup', signupValidation, _signup);
AuthRouter.post('/signin', signinValidation, _signin);
