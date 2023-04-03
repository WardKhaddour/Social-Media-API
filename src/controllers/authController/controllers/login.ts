import { Request, Response, NextFunction } from 'express';

import catchAsync from '../../../utils/catchAsync';
import User from '../../../models/User';
import { ReqBody } from '../../../interfaces/AuthReqBody';
import AppError from '../../../utils/AppError';
import { OK, UNAUTHORIZED } from '../../../constants';
import createAndSendToken from '../helpers/createAndSendToken';

const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password }: ReqBody = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return next(new AppError('Invalid credentials', UNAUTHORIZED));
    }

    if (user.cannotTryLogin()) {
      const remainingTime = (
        (user.loginAttemptsAt.getTime() - Date.now()) /
        (1000 * 60)
      ).toFixed(2);
      return next(
        new AppError(
          `Please wait ${remainingTime} minutes then retry`,
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
          `Invalid credentials, You have only ${user.totalLoginAttempts} remaining login attempts`,
          UNAUTHORIZED
        )
      );
    }

    await user.resetTotalAttempts();

    createAndSendToken(user, OK, 'Logged In', req, res);
  }
);

export default login;
