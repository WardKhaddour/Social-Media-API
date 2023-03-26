import express from 'express';
import AppError from '../utils/AppError';
import { FORBIDDEN } from '../constants';

const restrictTo = (...roles: [string]) => {
  return (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (!req.user || !roles.includes(req.user.role!)) {
      return next(
        new AppError(
          'You do not have permission to perform this action',
          FORBIDDEN
        )
      );
    }
    next();
  };
};

export default restrictTo;
