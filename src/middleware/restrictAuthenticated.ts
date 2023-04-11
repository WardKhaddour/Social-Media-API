import express from 'express';
import jwt from 'jsonwebtoken';

import catchAsync from '../utils/catchAsync';
import AppError from '../utils/AppError';
import { UNAUTHORIZED } from '../constants';
import User from '../models/User';

interface CheckAuthenticationOptions {
  withPassword: boolean;
}

const JWTVerify = (
  token: string,
  secret: string
): Promise<string | jwt.JwtPayload | undefined> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, payload) => {
      if (err) {
        reject(err);
      } else {
        resolve(payload);
      }
    });
  });
};

const restrictAuthenticated = (
  options: CheckAuthenticationOptions = { withPassword: false }
) =>
  catchAsync(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      //1) Getting the token and check if exist
      const token = req.cookies.jwt;

      if (!token) {
        return next(new AppError(req.i18n.t('msg.notLoggedIn'), UNAUTHORIZED));
      }

      //2) Verification token
      const decodedToken = await JWTVerify(token, process.env.JWT_SECRET!);

      const userId =
        typeof decodedToken === 'string' ? decodedToken : decodedToken?.userId;
      //3) Check if user still exists
      const currentUser = options.withPassword
        ? await User.findById(userId).select('+password')
        : await User.findById(userId);

      if (!currentUser) {
        return next(new AppError(req.i18n.t('msg.deletedUser'), UNAUTHORIZED));
      }

      //4) Check if user changed password after the token was issued

      const tokenIssuedAt =
        typeof decodedToken === 'string'
          ? +decodedToken
          : decodedToken?.iat || 0;

      if (currentUser.changedPasswordAfter(tokenIssuedAt)) {
        return next(
          new AppError(req.i18n.t('msg.passwordChangedRecently'), UNAUTHORIZED)
        );
      }

      // if (!currentUser.emailIsConfirmed) {
      //   return res.status(UNAUTHORIZED).json({
      //     success: false,
      //     message: 'Please confirm your email first',
      //     data: {
      //       user: {
      //         name: currentUser.name,
      //         email: currentUser.email,
      //       },
      //     },
      //   });
      // }

      //GRANT ACCESS TO PROTECTED ROUTE
      req.user = currentUser;
      next();
    }
  );

export default restrictAuthenticated;
