"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const signToken = (userId) => {
    const token = jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
    return token;
};
const createAndSendToken = (user, statusCode, message, req, res) => {
    const token = signToken(user._id);
    const cookieExpiresIn = +process.env.JWT_COOKIE_EXPIRES_IN;
    const cookieOptions = {
        expires: new Date(Date.now() + cookieExpiresIn * 24 * 60 * 60 * 1000),
        secure: false,
        httpOnly: true,
    };
    if (process.env.NODE_ENV === 'production') {
        cookieOptions.secure = true;
    }
    res.cookie('jwt', token, cookieOptions);
    res.status(statusCode).json({
        success: true,
        message,
        data: {
            user: {
                name: user.name,
                email: user.email,
                photo: user.photo,
                emailIsConfirmed: user.emailIsConfirmed,
            },
        },
    });
};
exports.default = createAndSendToken;
