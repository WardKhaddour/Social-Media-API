"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const constants_1 = require("../constants");
const User_1 = __importDefault(require("../models/User"));
const JWTVerify = (token, secret) => {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.verify(token, secret, (err, payload) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(payload);
            }
        });
    });
};
const checkAuthenticated = (options = { withPassword: false }) => (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const error = {
        message: '',
        statusCode: constants_1.UNAUTHORIZED,
    };
    //1) Getting the token and check if exist
    const token = req.cookies.jwt;
    if (!token) {
        error.message = req.i18n.t('userAuthMsg.notLoggedIn');
        res.locals.error = error;
        return next();
    }
    //2) Verification token
    const decodedToken = yield JWTVerify(token, process.env.JWT_SECRET).catch(err => {
        error.message = err.message;
        res.locals.error = error;
        return next();
    });
    const userId = typeof decodedToken === 'string' ? decodedToken : decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.userId;
    //3) Check if user still exists
    const currentUser = options.withPassword
        ? yield User_1.default.findById(userId).select('+password')
        : yield User_1.default.findById(userId);
    if (!currentUser) {
        error.message = req.i18n.t('userAuthMsg.deletedUser');
        res.locals.error = error;
        return next();
    }
    //4) Check if user changed password after the token was issued
    const tokenIssuedAt = typeof decodedToken === 'string'
        ? +decodedToken
        : (decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.iat) || 0;
    if (currentUser.changedPasswordAfter(tokenIssuedAt)) {
        error.message = req.i18n.t('userAuthMsg.passwordChangedRecently');
        res.locals.error = error;
        return next();
    }
    //Populate User to Request Object
    req.user = currentUser;
    next();
}));
exports.default = checkAuthenticated;
