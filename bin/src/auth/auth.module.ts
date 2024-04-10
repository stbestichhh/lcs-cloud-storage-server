import express from 'express';
import { signinValidation, signupValidation } from '../middleware';
import { _signin, _signup } from './auth.controller';
export { _getUser } from './auth.controller';

export const AuthRouter = express.Router();

AuthRouter.post('/signup', signupValidation, _signup);
AuthRouter.post('/signin', signinValidation, _signin);

//! File should be renamed with the name that describes what it does
