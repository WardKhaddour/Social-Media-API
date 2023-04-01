import { Request, Response, NextFunction } from 'express';
import { NOT_FOUND } from '../../../constants';
import User from '../../../models/User';
import AppError from '../../../utils/AppError';
import catchAsync from '../../../utils/catchAsync';
import sendEmailConfirmationLink from '../helpers/sendEmailConfirmationLink';

const resendConfirmToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(
        new AppError('No user found with this email address', NOT_FOUND)
      );
    }
    await sendEmailConfirmationLink(
      user,
      res,
      next,
      'Your confirm email token'
    );
  }
);

export default resendConfirmToken;
