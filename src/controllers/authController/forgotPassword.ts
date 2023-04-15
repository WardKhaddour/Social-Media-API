import { Request, Response, NextFunction } from 'express';

import catchAsync from '../../utils/catchAsync';
import User from '../../models/User';
import AppError from '../../utils/AppError';
import { NOT_FOUND, SERVER_ERROR } from '../../constants';
import Email from '../../utils/Email';

const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return next(new AppError(req.i18n.t('msg.noUserEmail'), NOT_FOUND));
    }
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    try {
      const email = new Email(user.email, resetToken);
      await email.sendPasswordReset();

      res.status(200).json({
        success: true,
        message: req.i18n.t('msg.tokenSent'),
      });
    } catch (err) {
      console.log(err);

      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return next(
        new AppError(req.i18n.t('msg.serverErrorOccurred'), SERVER_ERROR)
      );
    }
  }
);

export default forgotPassword;
