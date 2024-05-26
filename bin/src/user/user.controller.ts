import express from 'express';
import { loginValidation } from '../middleware';
import { getUser, updateUser } from './user.service';

export const UserRouter = express.Router();

UserRouter.use(loginValidation);
UserRouter.get('/me', getUser);
UserRouter.patch('/me', updateUser);
