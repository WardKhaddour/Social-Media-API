import express from 'express';
import jwt from 'jsonwebtoken';

import catchAsync from '../utils/catchAsync';
import AppError from '../utils/AppError';
import { UNAUTHORIZED } from '../constants';
import User from '../models/User';
import checkAuthenticated from './checkAuthenticated';

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
      checkAuthenticated(options)(req, res, () => {
        const { error } = res.locals;
        if (error) {
          return next(new AppError(error.message, error.statusCode));
        }
        next();
      });
    }
  );

export default restrictAuthenticated;
