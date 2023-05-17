"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsync = (asyncFunction) => (req, res, next) => {
    asyncFunction(req, res, next).catch((err) => next(err));
};
exports.default = catchAsync;
