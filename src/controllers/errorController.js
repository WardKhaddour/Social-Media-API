"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const AppError_1 = __importDefault(require("../utils/AppError"));
const handleCastErrorDB = (err, req) => {
    console.log(err.name);
    const message = `${req.i18n.t('userAuthMsg.invalid')} ${err.path}: ${err.value}`;
    return new AppError_1.default(message, constants_1.BAD_REQUEST);
};
const handleDuplicateFieldsDB = (err, req) => {
    let message = req.i18n.t('userAuthMsg.duplicateField') +
        req.i18n.t('userAuthMsg.useOtherValue');
    const regEx = /(["'])(\\?.)*?\1/;
    if (err.errmsg && err.errmsg.match(regEx)) {
        const value = err.errmsg.match(regEx)[0] || '';
        message = `${req.i18n.t('userAuthMsg.duplicateField')} ${value} ${req.i18n.t('userAuthMsg.useOtherValue')} .`;
    }
    return new AppError_1.default(message, constants_1.BAD_REQUEST);
};
const handleValidationErrorDB = (err, req) => {
    const message = req.i18n.t('userAuthMsg.invalidData');
    return new AppError_1.default(message, constants_1.BAD_REQUEST);
};
const handleJWTError = (req) => {
    return new AppError_1.default(req.i18n.t('userAuthMsg.invalidToken'), constants_1.UNAUTHORIZED);
};
const handleJWTExpiredError = (req) => new AppError_1.default(req.i18n.t('userAuthMsg.serverError'), constants_1.UNAUTHORIZED);
const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        success: false,
        message: err.message,
        stack: err.stack,
        error: err,
        data: null,
    });
};
const sendErrorProd = (err, req, res) => {
    if (err.isOperational)
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            data: null,
        });
    console.error('Error 💣️💣️', err);
    res.status(constants_1.SERVER_ERROR).json({
        success: false,
        message: req.i18n.t('userAuthMsg.serverError'),
        data: null,
    });
};
const globalErrorHandler = (err, req, res, next) => {
    err.statusCode || (err.statusCode = constants_1.SERVER_ERROR);
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
exports.default = globalErrorHandler;
