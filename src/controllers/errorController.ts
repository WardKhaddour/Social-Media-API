import express from 'express';
import { SERVER_ERROR, BAD_REQUEST, UNAUTHORIZED } from '../constants';
import AppError from '../utils/AppError';

const handleCastErrorDB = (err: AppError, req: express.Request) => {
  console.log(err.name);

  const message = `${req.i18n.t('userAuthMsg.invalid')} ${err.path}: ${
    err.value
  }`;
  return new AppError(message, BAD_REQUEST);
};

const handleDuplicateFieldsDB = (err: AppError, req: express.Request) => {
  let message: string =
    req.i18n.t('userAuthMsg.duplicateField') +
    req.i18n.t('userAuthMsg.useOtherValue');
  const regEx = /(["'])(\\?.)*?\1/;
  if (err.errmsg && err.errmsg.match(regEx)) {
    const value: string = err.errmsg.match(regEx)![0] || '';
    message = `${req.i18n.t(
      'userAuthMsg.duplicateField'
    )} ${value} ${req.i18n.t('userAuthMsg.useOtherValue')} .`;
  }

  return new AppError(message, BAD_REQUEST);
};

const handleValidationErrorDB = (err: AppError, req: express.Request) => {
  const message = req.i18n.t('userAuthMsg.invalidData');
  return new AppError(message, BAD_REQUEST);
};

const handleJWTError = (req: express.Request) => {
  return new AppError(req.i18n.t('userAuthMsg.invalidToken'), UNAUTHORIZED);
};

const handleJWTExpiredError = (req: express.Request) =>
  new AppError(req.i18n.t('userAuthMsg.serverError'), UNAUTHORIZED);

const sendErrorDev = (err: AppError, res: express.Response) => {
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    stack: err.stack,
    error: err,
    data: null,
  });
};

const sendErrorProd = (
  err: AppError,
  req: express.Request,
  res: express.Response
) => {
  if (err.isOperational)
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      data: null,
    });
  console.error('Error 💣️💣️', err);

  res.status(SERVER_ERROR).json({
    success: false,
    message: req.i18n.t('userAuthMsg.serverError'),
    data: null,
  });
};

const globalErrorHandler: express.ErrorRequestHandler = (
  err: AppError,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  err.statusCode ||= SERVER_ERROR;
  if (process.env.NODE_ENV === 'development') {
    return sendErrorDev(err, res);
  }

  // let error: AppError = Object.assign({}, err);
  // PRODUCTION
  console.log(err);

  if (err.name === 'CastError') {
    err = handleCastErrorDB(err, req);
  }

  if (err.code === 11000) {
    err = handleDuplicateFieldsDB(err, req);
  }

  if (err.name === 'ValidationError') {
    err = handleValidationErrorDB(err, req);
  }
  if (err.name === 'JsonWebTokenError') {
    err = handleJWTError(req);
  }
  if (err.name === 'TokenExpiredError') {
    err = handleJWTExpiredError(req);
  }
  sendErrorProd(err, req, res);
};

export default globalErrorHandler;
