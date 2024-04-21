import rateLimit from 'express-rate-limit';

export const limiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 35,
  message: 'You have exceeded request limit.',
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});
