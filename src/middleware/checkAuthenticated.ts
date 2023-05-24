import express from 'express';
import jwt from 'jsonwebtoken';
import catchAsync from '../utils/catchAsync';
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

const checkAuthenticated = (
  options: CheckAuthenticationOptions = { withPassword: false }
) =>
  catchAsync(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      const error = {
        message: '',
        statusCode: UNAUTHORIZED,
      };
      //1) Getting the token and check if exist

      if (!req.headers.authorization) {
        res.locals.error = error;
        return next();
      }

      const token = req.headers.authorization.split('Bearer')[1].trim();

      if (!token) {
        res.locals.error = error;
        return next();
      }

      //2) Verification token
      try {
        const decodedToken = await JWTVerify(token, process.env.JWT_SECRET!);

        const userId =
          typeof decodedToken === 'string'
            ? decodedToken
            : decodedToken?.userId;
        //3) Check if user still exists
        const currentUser = options.withPassword
          ? await User.findById(userId).select('+password')
          : await User.findById(userId);

        if (!currentUser) {
          error.message = req.i18n.t('userAuthMsg.deletedUser');
          res.locals.error = error;
          return next();
        }

        //4) Check if user changed password after the token was issued

        const tokenIssuedAt =
          typeof decodedToken === 'string'
            ? +decodedToken
            : decodedToken?.iat || 0;

        if (currentUser.changedPasswordAfter(tokenIssuedAt)) {
          error.message = req.i18n.t('userAuthMsg.passwordChangedRecently');
          res.locals.error = error;
          return next();
        }

        //Populate User to Request Object
        req.user = currentUser;
        next();
      } catch (err: any) {
        error.message = '';
        res.locals.error = error;

        return next();
      }
    }
  );

export default checkAuthenticated;
