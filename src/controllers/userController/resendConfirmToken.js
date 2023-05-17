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
const constants_1 = require("../../constants");
const User_1 = __importDefault(require("../../models/User"));
const AppError_1 = __importDefault(require("../../utils/AppError"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendEmailConfirmationLink_1 = __importDefault(require("../../utils/sendEmailConfirmationLink"));
const resendConfirmToken = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findOne({ email: req.body.email });
    if (!user) {
        return next(new AppError_1.default(req.i18n.t('userAuthMsg.noUserEmail'), constants_1.NOT_FOUND));
    }
    try {
        yield (0, sendEmailConfirmationLink_1.default)(user, req, next);
    }
    catch (err) {
        return next(new AppError_1.default(req.i18n.t('userAuthMsg.serverError'), constants_1.SERVER_ERROR));
    }
    res.status(constants_1.OK).json({
        success: true,
        message: req.i18n.t('userAuthMsg.tokenSent'),
    });
}));
exports.default = resendConfirmToken;
