import { body, validationResult } from 'express-validator';
import { NextFunction, Request, Response } from 'express';

export const directoryServiceValidation = [
  body('path')
    .isString()
    .withMessage('Target pass is missing.'),
  body('newPath')
    .optional()
    .isString(),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ Errors: errors.array() });
    }

    next();
  },
];
