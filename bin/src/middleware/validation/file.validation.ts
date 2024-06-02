import { body, validationResult } from 'express-validator';
import { NextFunction, Request, Response } from 'express';

export const fileServiceValidation = [
  body('path').isString().withMessage('Target pass is missing.'),
  body('content').optional().isString(),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ Errors: errors.array() });
    }

    next();
  },
];
