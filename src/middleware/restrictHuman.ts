import { Request, Response, NextFunction } from 'express';
import validateHuman from '../utils/validateHuman';
import AppError from '../utils/AppError';
import { BAD_REQUEST } from '../constants';

const restrictHuman = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return next();
  if (process.env.NODE_ENV === 'development') {
    return next();
  }

  const { recaptchaToken } = req.body;
  const isHuman = await validateHuman(recaptchaToken!);
  if (!isHuman) {
    return next(new AppError(req.i18n.t('userAuthMsg.bot'), BAD_REQUEST));
  }

  next();
};

export default restrictHuman;
