import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

import catchAsync from '../../utils/catchAsync';
import User from '../../models/User';
import AppError from '../../utils/AppError';
import { BAD_REQUEST, OK } from '../../constants';
import createAndSendToken from '../../utils/createAndSendToken';

const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return next(
        new AppError(req.i18n.t('msg.invalidExpiredToken'), BAD_REQUEST)
      );
    }

    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();
    createAndSendToken(user, OK, req.i18n.t('msg.changedPassword'), req, res);
  }
);

export default resetPassword;
