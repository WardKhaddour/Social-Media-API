import express from 'express';
import { SERVER_ERROR, BAD_REQUEST, UNAUTHORIZED } from '../constants';
import AppError from '../utils/AppError';

const handleCastErrorDB = (err: AppError) => {
  console.log(err.name);

  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, BAD_REQUEST);
};

const handleDuplicateFieldsDB = (err: AppError) => {
  let message: string = 'Duplicate field value. Please use another value';
  const regEx = /(["'])(\\?.)*?\1/;
  if (err.errmsg && err.errmsg.match(regEx)) {
    const value: string = err.errmsg.match(regEx)![0] || '';
    message = `Duplicate field value ${value}. Please use another value`;
  }

  return new AppError(message, BAD_REQUEST);
};

const handleValidationErrorDB = (err: AppError) => {
  const message = `Invalid Input Data`;
  return new AppError(message, BAD_REQUEST);
};

const handleJWTError = () => {
  return new AppError('Invalid Token. Please login again', UNAUTHORIZED);
};

const handleJWTExpiredError = () =>
  new AppError('Your Token has expired!. Please login again', UNAUTHORIZED);

const sendErrorDev = (err: AppError, res: express.Response) => {
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    stack: err.stack,
    error: err,
    data: null,
  });
};

const sendErrorProd = (err: AppError, res: express.Response) => {
  if (err.isOperational)
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      data: null,
    });
  console.error('Error 💣️💣️', err);

  res.status(SERVER_ERROR).json({
    success: false,
    message: 'Something went wrong',
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
    err = handleCastErrorDB(err);
  }

  if (err.code === 11000) {
    err = handleDuplicateFieldsDB(err);
  }

  if (err.name === 'ValidationError') {
    err = handleValidationErrorDB(err);
  }
  if (err.name === 'JsonWebTokenError') {
    err = handleJWTError();
  }
  if (err.name === 'TokenExpiredError') {
    err = handleJWTExpiredError();
  }
  sendErrorProd(err, res);
};

export default globalErrorHandler;
