"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppError extends Error {
    constructor(message, statusCode, path, value, code, errmsg) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        this.path = path;
        this.value = value;
        this.code = code;
        this.errmsg = errmsg;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.default = AppError;
