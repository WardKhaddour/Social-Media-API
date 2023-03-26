import express from 'express';
import AppError from './AppError';

const catchAsync =
  (asyncFunction: Function) =>
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    asyncFunction(req, res, next).catch((err: AppError) => next(err));
  };

export default catchAsync;
