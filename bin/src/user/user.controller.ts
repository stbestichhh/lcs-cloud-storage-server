import express from 'express';
import { editUserValidation, loginValidation } from '../middleware';
import { getUser, updateUser } from './user.service';

export const UserRouter = express.Router();

UserRouter.use(loginValidation);
UserRouter.get('/me', getUser);
UserRouter.patch('/me', editUserValidation, updateUser);
