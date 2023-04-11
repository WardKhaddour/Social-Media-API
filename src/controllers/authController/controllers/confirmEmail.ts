import { Request, Response, NextFunction } from 'express';
import { BAD_REQUEST, OK } from '../../../constants';
import User from '../../../models/User';
import AppError from '../../../utils/AppError';
import catchAsync from '../../../utils/catchAsync';
import createAndSendToken from '../helpers/createAndSendToken';
import crypto from 'crypto';

const confirmEmail = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      emailConfirmToken: hashedToken,
      emailConfirmExpires: { $gt: Date.now() },
    });

    if (!user) {
      return next(
        new AppError(req.i18n.t('msg.invalidExpiredToken'), BAD_REQUEST)
      );
    }

    user.emailIsConfirmed = true;
    user.emailConfirmToken = undefined;
    user.emailConfirmExpires = undefined;

    await user.save();
    createAndSendToken(user, OK, req.i18n.t('msg.welcome'), req, res);
  }
);

export default confirmEmail;
