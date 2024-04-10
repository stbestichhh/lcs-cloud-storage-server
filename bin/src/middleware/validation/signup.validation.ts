import { body, validationResult } from 'express-validator';
import { NextFunction, Request, Response } from 'express';

export const signupValidation = [
  body('name')
    .isString()
    .isLength({ min: 3 })
    .withMessage('Name must be 3 or more characters length.'),
  body('email').isEmail().withMessage('Wrong email format.'),
  body('password')
    .isString()
    .isLength({ min: 6 })
    .withMessage('Pussword must be 6 or more characters length.'),
  body('password_repeat')
    .isString()
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Pusswords must math.'),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ Errors: errors.array() });
    }

    next();
  },
];
