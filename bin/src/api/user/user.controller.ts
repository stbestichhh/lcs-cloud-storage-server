import express from 'express';
import { editUserValidation, loginValidation } from '../../middleware';
import { createDirectory, getUser, updateUser } from './user.service';

export const UserRouter = express.Router();

UserRouter.use(loginValidation);
UserRouter.route('/me')
  .get(getUser)
  .patch(editUserValidation, updateUser)
  .post(createDirectory);
