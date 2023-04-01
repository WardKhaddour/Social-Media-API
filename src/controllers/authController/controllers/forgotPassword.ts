import { Request, Response, NextFunction } from 'express';

import catchAsync from '../../../utils/catchAsync';
import User from '../../../models/User';
import AppError from '../../../utils/AppError';
import { NOT_FOUND, SERVER_ERROR } from '../../../constants';
import sendEmail from '../../../utils/email';

const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return next(
        new AppError('There is no user with this email address', NOT_FOUND)
      );
    }
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const message = `Forgot your password?\n
    Your Reset Token is ${resetToken} \n
    It's only valid for 10 minutes!!.\n
    If you didn't forgot your password, please ignore this email`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Your password reset token (valid only for 10 minutes)',
        message,
      });
      res.status(200).json({
        success: true,
        message: 'Token sent to your email',
      });
    } catch (err) {
      console.log(err);

      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return next(
        new AppError('An Error occurred. Please try again later', SERVER_ERROR)
      );
    }
  }
);

export default forgotPassword;
