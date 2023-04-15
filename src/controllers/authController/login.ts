import { Request, Response, NextFunction } from 'express';

import catchAsync from '../../utils/catchAsync';
import User from '../../models/User';
import { ReqBody } from '../../interfaces/AuthReqBody';
import AppError from '../../utils/AppError';
import { OK, UNAUTHORIZED } from '../../constants';
import createAndSendToken from '../../utils/createAndSendToken';

const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password }: ReqBody = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return next(
        new AppError(req.i18n.t('msg.invalidCredentials'), UNAUTHORIZED)
      );
    }

    if (user.cannotTryLogin()) {
      const remainingTime = (
        (user.loginAttemptsAt.getTime() - Date.now()) /
        (1000 * 60)
      ).toFixed(2);
      return next(
        new AppError(
          req.i18n.t('msg.timeToLogin', { remainingTime }),
          UNAUTHORIZED
        )
      );
    }

    const isCorrectPassword = await user.isCorrectPassword(
      password,
      user.password
    );

    if (!isCorrectPassword) {
      await user.handleLoginAttemptFail();
      return next(
        new AppError(
          req.i18n.t('msg.failedLogin', { remaining: user.totalLoginAttempts }),
          UNAUTHORIZED
        )
      );
    }

    await user.resetTotalAttempts();

    createAndSendToken(user, OK, req.i18n.t('msg.loggedIn'), req, res);
  }
);

export default login;
