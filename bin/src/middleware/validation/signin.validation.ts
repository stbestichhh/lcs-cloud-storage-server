import { body, validationResult } from 'express-validator';
import { NextFunction, Request, Response } from 'express';

export const signinValidation = [
  body('email').isEmail().withMessage('Wrong email format.'),
  body('password')
    .isString()
    .isLength({ min: 6 })
    .withMessage('Pussword must be 6 or more characters length.'),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ Errors: errors.array() });
    }

    next();
  },
];
