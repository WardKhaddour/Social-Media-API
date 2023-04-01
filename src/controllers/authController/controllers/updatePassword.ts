import { Request, Response, NextFunction } from 'express';
import User from '../../../models/User';
import { UNAUTHORIZED, OK } from '../../../constants';
import catchAsync from '../../../utils/catchAsync';
import AppError from '../../../utils/AppError';
import createAndSendToken from '../helpers/createAndSendToken';

const updatePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { currentPassword, password } = req.body;

    const user = await User.findById(req.user?._id).select('+password');

    if (
      !user ||
      !(await user.isCorrectPassword(currentPassword, user.password))
    ) {
      return next(new AppError('Your current password is wrong', UNAUTHORIZED));
    }

    user.password = password;
    await user.save();

    createAndSendToken(user, OK, 'Password changed successfully', req, res);
  }
);

export default updatePassword;
