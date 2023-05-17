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
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const User_1 = __importDefault(require("../../models/User"));
const AppError_1 = __importDefault(require("../../utils/AppError"));
const constants_1 = require("../../constants");
const Email_1 = __importDefault(require("../../utils/Email"));
const forgotPassword = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findOne({ email: req.body.email });
    if (!user) {
        return next(new AppError_1.default(req.i18n.t('userAuthMsg.noUserEmail'), constants_1.NOT_FOUND));
    }
    const resetToken = user.createPasswordResetToken();
    yield user.save({ validateBeforeSave: false });
    try {
        const email = new Email_1.default(user.email, resetToken);
        yield email.sendPasswordReset();
        res.status(200).json({
            success: true,
            message: req.i18n.t('userAuthMsg.tokenSent'),
        });
    }
    catch (err) {
        console.log(err);
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        yield user.save({ validateBeforeSave: false });
        return next(new AppError_1.default(req.i18n.t('userAuthMsg.serverErrorOccurred'), constants_1.SERVER_ERROR));
    }
}));
exports.default = forgotPassword;
