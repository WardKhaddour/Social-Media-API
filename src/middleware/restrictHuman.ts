import { Request, Response, NextFunction } from 'express';
import validateHuman from '../utils/validateHuman';
import AppError from '../utils/AppError';
import { BAD_REQUEST } from '../constants';

const restrictHuman = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (process.env.NODE_ENV === 'development') {
    return next();
  }

  const { recaptchaToken } = req.body;
  const isHuman = await validateHuman(recaptchaToken!);
  if (!isHuman) {
    return next(new AppError('Caught you, bot!', BAD_REQUEST));
  }

  next();
};

export default restrictHuman;
