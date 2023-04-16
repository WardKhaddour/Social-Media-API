import { NOT_FOUND, OK } from './../../constants';
import { Request, Response, NextFunction } from 'express';

import User from '../../models/User';
import AppError from '../../utils/AppError';

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  const query = User.findById(userId).populate('posts');

  query.setOptions({
    notAuthData: true,
  });

  const user = await query;

  if (!user) {
    return next(new AppError('User Not Found', NOT_FOUND));
  }

  res.status(OK).json({
    success: true,
    message: req.i18n.t('userAuthMsg.gotUserSuccess'),
    data: {
      user,
    },
  });
};
export default getUserById;
