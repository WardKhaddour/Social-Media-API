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
const Email_1 = __importDefault(require("./Email"));
const AppError_1 = __importDefault(require("./AppError"));
const constants_1 = require("../constants");
const sendEmailConfirmationLink = (user, req, next) => __awaiter(void 0, void 0, void 0, function* () {
    const confirmToken = user.createEmailConfirmToken();
    yield user.save({ validateBeforeSave: false });
    try {
        const email = new Email_1.default(user.email, confirmToken);
        yield email.sendEmailConfirm();
    }
    catch (err) {
        user.emailConfirmToken = undefined;
        user.emailConfirmExpires = undefined;
        yield user.save({ validateBeforeSave: false });
        return next(new AppError_1.default(req.i18n.t('userAuthMsg.serverErrorOccurred'), constants_1.SERVER_ERROR));
    }
});
exports.default = sendEmailConfirmationLink;
